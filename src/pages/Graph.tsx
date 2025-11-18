import React, { useEffect, useRef, useState, useCallback } from 'react';
import { message, Menu, Switch, ColorPicker, InputNumber, Upload, Form, Input, Select, Space, Divider, Button, Card } from 'antd';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  CompressOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
  CopyOutlined,
  EditOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Graph as X6Graph, Cell, Node, Edge } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Scroller } from '@antv/x6-plugin-scroller';
import { Transform } from '@antv/x6-plugin-transform';
import {
  nodeTypes,
  getNodeDefaults,
  NodeType,
  edgeTypes,
  getEdgeDefaults,
  EdgeType,
  nodeEditableProps,
  edgeEditableProps,
} from './flowSchema';
import type { MenuProps } from 'antd';

const FlowEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [graph, setGraph] = useState<X6Graph | null>(null);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const dndRef = useRef<Dnd | null>(null);
  const [placingEdgeType, setPlacingEdgeType] = useState<EdgeType | null>(null);
  const [edgeSourceId, setEdgeSourceId] = useState<string | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [contextCell, setContextCell] = useState<Cell | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [showPorts, setShowPorts] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  

  
  



  

  


  

  // 初始化图与插件
  useEffect(() => {
    X6Graph.registerNode('custom-rect', { inherit: 'rect' }, true);
    X6Graph.registerNode('custom-circle', { inherit: 'circle' }, true);
    X6Graph.registerNode('custom-polygon', { inherit: 'polygon' }, true);

    const g: X6Graph = new X6Graph({
      container: containerRef.current!,
      grid: { size: 10, visible: showGrid },
      panning: true,
      mousewheel: { enabled: true, modifiers: ['ctrl'] },
      connecting: {
        allowLoop: false,
        allowNode: true,
        allowEdge: false,
        highlight: true,
        snap: snapEnabled,
        anchor: 'center',
        connectionPoint: 'boundary',
        createEdge() {
          return new Edge({
            shape: 'edge',
            attrs: getEdgeDefaults('default').attrs,
            labels: getEdgeDefaults('default').labels,
            router: getEdgeDefaults('default').router,
            connector: getEdgeDefaults('default').connector,
          });
        },
        validateConnection({ sourceCell, targetCell }): boolean {
          if (!sourceCell || !targetCell) return false;
          if (sourceCell === targetCell) return false;
          return true;
        },
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: { attrs: { fill: '#5F95FF', stroke: '#5F95FF' } },
        },
        magnetAdsorbed: {
          name: 'stroke',
          args: { attrs: { fill: '#5AF', stroke: '#5AF' } },
        },
      },
      background: { color: '#f5f5f5' },
    });

    g.use(
      new Snapline({
        enabled: snapEnabled,
        className: 'x6-snapline',
        tolerance: 10,
      })
    );
    g.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
        showEdgeSelectionBox: true,
      })
    );
    g.use(new Keyboard({ enabled: true, global: true }));
    g.use(new Clipboard({ enabled: true }));
    g.use(new History({ enabled: true }));
    g.use(new Scroller({ enabled: true }));
    g.use(
      new Transform({
        resizing: { enabled: true, minWidth: 20, minHeight: 20 },
        rotating: { enabled: false },
      })
    );

    // 事件监听
    g.on('cell:click', ({ cell }: { cell: Cell }) => {
      setSelectedCellId(cell.id);
      const type = cell.isEdge() ? 'edge' : 'node';
      const fields: Record<string, unknown> = { type };
      const props = cell.isEdge() ? edgeEditableProps : nodeEditableProps;
      props.forEach((p) => {
        fields[p.path] = getCellValue(cell, p.path);
      });
      form.setFieldsValue(fields);
    });

    g.on('blank:click', () => {
      setSelectedCellId(null);
      form.resetFields();
    });

    g.on('cell:contextmenu', ({ cell, e }: { cell: Cell; e: MouseEvent }) => {
      e.preventDefault();
      setContextCell(cell);
      setContextMenuPos({ x: e.clientX, y: e.clientY });
      setContextMenuVisible(true);
    });

    g.on('node:moved', () => {
      if (autoSave) {
        debouncedAutoSaveRef.current();
      }
    });

    g.on('node:resized', () => {
      if (autoSave) {
        debouncedAutoSaveRef.current();
      }
    });

    g.on('edge:connected', () => {
      if (autoSave) {
        debouncedAutoSaveRef.current();
      }
    });

    // 快捷键
    g.bindKey(['ctrl+z', 'cmd+z'], () => {
      g.undo();
      return false;
    });
    g.bindKey(['ctrl+y', 'cmd+y'], () => {
      g.redo();
      return false;
    });
    g.bindKey(['ctrl+c', 'cmd+c'], () => {
      const cells = g.getSelectedCells();
      if (cells.length) {
        g.copy(cells);
      }
      return false;
    });
    g.bindKey(['ctrl+v', 'cmd+v'], () => {
      if (!g.isClipboardEmpty()) {
        const cells = g.paste({ offset: 32 });
        g.cleanSelection();
        g.select(cells);
      }
      return false;
    });
    g.bindKey(['delete', 'backspace'], () => {
      const cells = g.getSelectedCells();
      if (cells.length) {
        g.removeCells(cells);
      }
      return false;
    });

    // 初始化示例
    const start = g.addNode({
      x: 80,
      y: 80,
      ...(getNodeDefaults('start') as any),
    } as any);

    const task = g.addNode({
      x: 300,
      y: 80,
      ...(getNodeDefaults('task') as any),
    } as any);

    g.addEdge({
      source: start,
      target: task,
      ...getEdgeDefaults('default'),
    });

    setGraph(g);
    dndRef.current = new Dnd({ target: g, scaled: false });

    return () => {
      g.dispose();
    };
  }, [showGrid, snapEnabled, autoSave, form]);

  // 工具栏操作
  const handleZoomIn = () => graph && graph.zoom(0.1);
  const handleZoomOut = () => graph && graph.zoom(-0.1);
  const handleFit = () => graph && graph.zoomToFit({ padding: 20 });
  const handleUndo = () => graph && graph.undo();
  const handleRedo = () => graph && graph.redo();

  const handleSave = useCallback(() => {
    if (!graph) return;
    const data = graph.toJSON();
    localStorage.setItem('flowchart', JSON.stringify(data));
    setLastSaved(new Date());
    message.success('已保存');
  }, [graph]);

  // 防抖自动保存
  const debouncedAutoSaveRef = useRef<() => void>(() => {});
  useEffect(() => {
    debouncedAutoSaveRef.current = debounce(() => {
      handleSave();
    }, 2000);
  }, [graph, handleSave]);

  

  const handleLoad = () => {
    if (!graph) return;
    const raw = localStorage.getItem('flowchart');
    if (!raw) return;
    const data = JSON.parse(raw);
    graph.fromJSON(data);
    message.success('已加载');
  };

  const handleExportJSON = () => {
    if (!graph) return;
    const data = graph.toJSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowchart.json';
    a.click();
    URL.revokeObjectURL(url)
    message.success('已导出');
  };

  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (graph) {
          graph.fromJSON(data);
          message.success('已导入');
        }
      } catch {
        message.error('导入失败：格式错误');
      }
    };
    reader.readAsText(file);
    return false;
  };

  // 优化后的流程验证 - 使用邻接表提高性能
  const handleValidateFlow = () => {
    if (!graph) return;
    const nodes = graph.getNodes();
    const edges = graph.getEdges();

    const errors: string[] = [];

    // 检查孤立节点
    nodes.forEach((node) => {
      const connectedEdges = edges.filter((edge) => {
        const src = edge.getSourceCell();
        const tgt = edge.getTargetCell();
        return src === node || tgt === node;
      });
      if (connectedEdges.length === 0) {
        errors.push(`节点 "${node.attr('label/text') || node.id}" 未连接`);
      }
    });

    // 检查开始节点
    const startNodes = nodes.filter((node) => node.attr('body/fill') === '#52c41a');
    if (startNodes.length === 0) {
      errors.push('缺少开始节点');
    } else if (startNodes.length > 1) {
      errors.push('存在多个开始节点');
    }

    // 检查结束节点
    const endNodes = nodes.filter((node) => node.attr('body/fill') === '#ff4d4f');
    if (endNodes.length === 0) {
      errors.push('缺少结束节点');
    }

    // 检查循环
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = edges.filter((edge) => {
        const src = edge.getSourceCell();
        return src?.id === nodeId;
      });

      for (const edge of outgoingEdges) {
        const target = edge.getTargetCell();
        if (target && hasCycle(target.id)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    startNodes.forEach((node) => {
      if (hasCycle(node.id)) {
        errors.push('检测到循环依赖');
      }
    });

    if (errors.length > 0) {
      message.error(
        <div>
          <div>流程验证失败：</div>
          <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      );
    } else {
      message.success('流程验证通过');
    }
  };

  // 节点放置
  const [placingType, setPlacingType] = useState<NodeType | null>(null);

  const createNode = useCallback(
    (type: NodeType) => {
      if (!graph) return null;
      const cfg = getNodeDefaults(type);
      return graph.createNode({ ...(cfg as any) });
    },
    [graph]
  );

  const getNodeLabel = (type: NodeType) => {
    const cfg = getNodeDefaults(type);
    return cfg.label;
  };

  const handleNodeDragStart = (type: NodeType, e: React.MouseEvent) => {
    if (!graph || !dndRef.current) return;
    const node = createNode(type);
    if (!node) return;
    dndRef.current.start(node, e.nativeEvent as MouseEvent);
  };

  const nodePaletteItem = (type: NodeType, active: boolean) => {
    const cfg = getNodeDefaults(type);
    const scale = 0.6;
    const w = Math.max(60, Math.round(cfg.width * scale));
    const h = Math.max(40, Math.round(cfg.height * scale));
    const body = cfg.attrs.body;
    const isCircle = cfg.shape.includes('circle');
    const isPolygon = cfg.shape.includes('polygon');
    const clipPath = (() => {
      if (!isPolygon || !body.refPoints) return undefined;
      const pts = body.refPoints.split(' ').map(p => p.split(',').map(n => Number(n)));
      const poly = pts.map(([x,y]) => `${(x/cfg.width)*100}% ${(y/cfg.height)*100}%`).join(',');
      return `polygon(${poly})`;
    })();
    const style: React.CSSProperties = {
      width: w,
      height: h,
      background: body.fill,
      border: `${body.strokeWidth ?? 1}px solid ${body.stroke ?? '#999'}`,
      borderRadius: isCircle ? '50%' : `${body.rx ?? 0}px/${body.ry ?? 0}px`,
      clipPath,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: cfg.attrs.label.fill ?? '#fff',
      fontSize: Math.max(12, Math.round((cfg.attrs.label.fontSize ?? 14) * scale)),
      userSelect: 'none',
      boxShadow: active ? '0 0 0 2px #1890ff inset' : 'none',
      transition: 'transform 0.12s ease',
      cursor: 'grab',
    };
    return (
      <div
        key={type}
        onClick={() => setPlacingType(type)}
        onMouseDown={(e) => handleNodeDragStart(type, e)}
        style={{
          padding: 8,
          border: active ? '1px solid #1890ff' : '1px solid #e5e5e5',
          borderRadius: 6,
          background: active ? '#f0f9ff' : '#fff',
        }}
      >
        <div style={style}>{cfg.label}</div>
      </div>
    );
  };

  const edgePaletteItem = (type: EdgeType, active: boolean) => {
    const cfg = getEdgeDefaults(type);
    const line = cfg.attrs.line;
    const dash = line.strokeDasharray ? 'dash' : 'solid';
    return (
      <div
        key={type}
        onClick={() => { setPlacingEdgeType(type); setEdgeSourceId(null); }}
        style={{
          padding: 8,
          border: active ? '1px solid #1890ff' : '1px solid #e5e5e5',
          borderRadius: 6,
          background: active ? '#f0f9ff' : '#fff',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 120 }}>
            <svg width={120} height={24}>
              <defs>
                <marker id={`arrow-${type}`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={line.stroke ?? '#999'} />
                </marker>
              </defs>
              <line x1={8} y1={12} x2={112} y2={12}
                stroke={line.stroke ?? '#999'}
                strokeWidth={line.strokeWidth ?? 2}
                strokeDasharray={line.strokeDasharray}
                markerEnd={line.targetMarker ? `url(#arrow-${type})` : undefined}
              />
            </svg>
          </div>
          <span style={{ fontSize: 12, color: '#666' }}>{type}</span>
        </div>
      </div>
    );
  };

  // 边放置模式
  useEffect(() => {
    if (!graph) return;
    const onNodeClick = ({ node }: { node: Node }) => {
      if (!placingEdgeType) return;
      if (!edgeSourceId) {
        setEdgeSourceId(node.id);
        return;
      }
      const cfg = getEdgeDefaults(placingEdgeType);
      graph.addEdge({ source: edgeSourceId, target: node.id, ...cfg });
      setPlacingEdgeType(null);
      setEdgeSourceId(null);
    };
    graph.on('node:click', onNodeClick);
    return () => {
      graph.off('node:click');
    };
  }, [graph, placingEdgeType, edgeSourceId]);

  // 空白处放置节点
  useEffect(() => {
    if (!graph) return;
    const handler = ({ x, y }: { x: number; y: number }) => {
      if (placingType) {
        const node = createNode(placingType);
        if (node) {
          node.position(x - node.size().width / 2, y - node.size().height / 2);
          graph.addNode(node);
          setPlacingType(null);
        }
      }
      setSelectedCellId(null);
      form.resetFields();
    };
    graph.on('blank:click', handler);
    return () => {
      graph.off('blank:click');
    };
  }, [graph, placingType, createNode, form]);

  // 属性编辑
  const handleFormFinish = (values: Record<string, unknown>) => {
    if (!graph || !selectedCellId) return;
    const cell = graph.getCellById(selectedCellId) as Cell | null;
    if (!cell) return;
    // 批量更新属性，减少触发重绘次数
    const updates: Array<{ path: string; value: unknown }> = [];
    Object.keys(values).forEach((k) => {


      updates.push({ path: k, value: values[k] });
    });
    
    updates.forEach(({ path, value }) => {
      setCellValue(cell, path, value);
    });
  };

  const getCellValue = (cell: Cell, path: string) => {
    if (path === 'label') return cell.attr('label/text');
    if (path === 'width') return cell.isNode() ? (cell as Node).size().width : undefined;
    if (path === 'height') return cell.isNode() ? (cell as Node).size().height : undefined;
    if (path.startsWith('attrs/')) {
      const attrPath = path.replace('attrs/', '');
      return cell.attr(attrPath);
    }
    if (path.startsWith('labels/')) {
      const labels = (cell as Edge).getLabels();
      const pathParts = path.split('/');
      let target: unknown = labels as unknown;
      for (const part of pathParts.slice(1)) {
        if (typeof target === 'object' && target !== null) {
          const obj = target as Record<string, unknown>;
          target = obj[part];
        } else {
          return undefined;
        }
      }
      return target;
    }
    if (path === 'router/name' && cell.isEdge()) return (cell as Edge).getRouter()?.name;
    if (path === 'connector/name' && cell.isEdge()) return (cell as Edge).getConnector()?.name;
    return undefined;
  };

  const setCellValue = (cell: Cell, path: string, value: unknown) => {
    if (path === 'label') {
      if (cell.isEdge()) {
        (cell as Edge).setLabels([{ attrs: { label: { text: String(value ?? '') } } }]);
      } else {
        cell.attr('label/text', String(value ?? ''));
      }
      return;
    }
    if (path === 'width' && cell.isNode()) {
      const s = (cell as Node).size();
      (cell as Node).resize(Number(value) || s.width, s.height);
      return;
    }
    if (path === 'height' && cell.isNode()) {
      const s = (cell as Node).size();
      (cell as Node).resize(s.width, Number(value) || s.height);
      return;
    }
    if (path.startsWith('attrs/')) {
      const attrPath = path.replace('attrs/', '');
      cell.attr(attrPath as any, value as any);
      return;
    }
    if (path.startsWith('labels/')) {
      const labels = (cell as Edge).getLabels();
      const pathParts = path.split('/');
      let target: unknown = labels as unknown;
      for (let i = 1; i < pathParts.length - 1; i++) {
        if (typeof target === 'object' && target !== null) {
          const obj = target as Record<string, unknown>;
          target = obj[pathParts[i]];
        } else {
          return;
        }
      }
      if (typeof target === 'object' && target !== null) {
        const obj = target as Record<string, unknown>;
        obj[pathParts[pathParts.length - 1]] = value as unknown;
        (cell as Edge).setLabels(labels);
      }
      return;
    }
    if (path === 'router/name' && cell.isEdge()) {
      (cell as Edge).setRouter({ name: String(value) });
      return;
    }
    if (path === 'connector/name' && cell.isEdge()) {
      (cell as Edge).setConnector({ name: String(value) });
      return;
    }
  };

  // 右键菜单
  const handleContextMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (!graph || !contextCell) return;
    switch (key) {
      case 'delete':
        graph.removeCells([contextCell]);
        message.success('已删除');
        break;
      case 'copy':
        graph.copy([contextCell]);
        message.success('已复制');
        break;
      case 'duplicate': {
        const clone = contextCell.clone();
        clone.translate(20, 20);
        graph.addCell(clone);
        message.success('已复制');
        break;
      }
      case 'edit': {
        setSelectedCellId(contextCell.id);
        const type = contextCell.isEdge() ? 'edge' : 'node';
        const fields: Record<string, unknown> = { type };
        const props = contextCell.isEdge() ? edgeEditableProps : nodeEditableProps;
        props.forEach((p) => {
          fields[p.path] = getCellValue(contextCell, p.path);
        });
        form.setFieldsValue(fields);
        break;
      }
      default:
        break;
    }
    setContextMenuVisible(false);
  };

  const contextMenuItems: MenuProps['items'] = [
    { key: 'edit', icon: <EditOutlined />, label: '编辑属性' },
    { key: 'duplicate', icon: <CopyOutlined />, label: '复制' },
    { key: 'copy', icon: <CopyOutlined />, label: '复制到剪贴板' },
    { type: 'divider' },
    { key: 'delete', icon: <DeleteOutlined />, label: '删除', danger: true },
  ];

  // 防抖函数
  function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // 渲染属性编辑器
  const renderFieldEditor = (field: { path: string; label: string; type: string }, value: unknown, onChange: (val: unknown) => void) => {
    switch (field.type) {
      case 'color':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ColorPicker
              value={String(value || '#000000')}
              onChange={(_, hex) => onChange(hex)}
              showText
            />
            <Input
              value={String(value || '#000000')}
              onChange={(e) => onChange(e.target.value)}
              style={{ width: 100 }}
            />
          </div>
        );
      case 'number':
        return (
          <InputNumber
            value={Number(value) || 0}
            onChange={(val) => onChange(val)}
            style={{ width: '100%' }}
          />
        );
      case 'boolean':
        return (
          <Switch
            checked={Boolean(value)}
            onChange={(checked) => onChange(checked)}
          />
        );
      case 'string':
      default:
        return (
          <Input
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12}}>
      {/* 左侧工具栏 */}
      <Card style={{ width: 240, border: '1px solid #e5e5e5',overflow:'scroll',height: '100vh' }} title="组件库">
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>节点</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
            {nodeTypes.map((type) => nodePaletteItem(type, placingType === type))}
          </div>
        </div>

        <Divider />

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>连接线</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
            {edgeTypes.map((type) => edgePaletteItem(type, placingEdgeType === type))}
          </div>
        </div>

        <Divider />

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>画布设置</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span>网格</span>
            <Switch checked={showGrid} onChange={setShowGrid} size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span>吸附</span>
            <Switch checked={snapEnabled} onChange={setSnapEnabled} size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span>端口</span>
            <Switch checked={showPorts} onChange={setShowPorts} size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>自动保存</span>
            <Switch checked={autoSave} onChange={setAutoSave} size="small" />
          </div>
        </div>

        <Divider />

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>操作</div>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button icon={<UndoOutlined />} onClick={handleUndo} style={{ width: '100%' }}>
              撤销
            </Button>
            <Button icon={<RedoOutlined />} onClick={handleRedo} style={{ width: '100%' }}>
              重做
            </Button>
            <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} style={{ width: '100%' }}>
              缩小
            </Button>
            <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} style={{ width: '100%' }}>
              放大
            </Button>
            <Button icon={<CompressOutlined />} onClick={handleFit} style={{ width: '100%' }}>
              适配
            </Button>
          </Space>
        </div>

        <Divider />

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>文件</div>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button icon={<SaveOutlined />} onClick={handleSave} type="primary" style={{ width: '100%' }}>
              保存
            </Button>
            <Button icon={<UploadOutlined />} onClick={handleLoad} style={{ width: '100%' }}>
              加载
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportJSON} style={{ width: '100%' }}>
              导出JSON
            </Button>
            <Upload accept=".json" showUploadList={false} beforeUpload={handleImportJSON}>
              <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                导入JSON
              </Button>
            </Upload>
          </Space>
        </div>

        <Divider />

        <Button icon={<EditOutlined />} onClick={handleValidateFlow} style={{ width: '100%' }}>
          验证流程
        </Button>

        {lastSaved && (
          <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
            最后保存：{lastSaved.toLocaleTimeString()}
          </div>
        )}
      </Card>

      {/* 中间画布 */}
      <Card style={{ flex: 1, border: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column',height: '100vh',overflow:'scroll' }}>
        <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
          {placingEdgeType && (
            <span style={{ color: '#1890ff' }}>点击两个节点以创建连接线（当前：{placingEdgeType}）</span>
          )}
          {placingType && (
            <span style={{ color: '#1890ff' }}>点击空白处以放置节点（当前：{getNodeLabel(placingType)}）</span>
          )}
        </div>
        <div ref={containerRef} style={{ flex: 1, background: '#fff', minHeight: 600 }} />
      </Card>

      {/* 右侧属性面板 */}
      <Card style={{ width: 300, border: '1px solid #e5e5e5',overflow:'scroll',height: '100vh' }} title="属性">
        <Form layout="vertical" form={form} onFinish={handleFormFinish}>
          <Form.Item name="type" label="类型">
            <Select options={[{ label: '节点', value: 'node' }, { label: '边', value: 'edge' }]} disabled />
          </Form.Item>
          {selectedCellId &&
            graph &&
            (() => {
              const cell = graph.getCellById(selectedCellId);
              if (!cell) return null;
              const props = cell.isEdge() ? edgeEditableProps : nodeEditableProps;
              return (
                <>
                  {props.map((field) => {
                    const value = getCellValue(cell, field.path);
                    return (
                      <Form.Item key={field.path} label={field.label}>
                        {renderFieldEditor(field, value, (val) => {
                          setCellValue(cell, field.path, val);
                          const newFields: Record<string, unknown> = {};
                          props.forEach((p) => {
                            newFields[p.path] = getCellValue(cell, p.path);
                          });
                          form.setFieldsValue(newFields);
                        })}
                      </Form.Item>
                    );
                  })}
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      应用
                    </Button>
                  </Form.Item>
                </>
              );
            })()}
        </Form>
      </Card>

      {/* 右键菜单 */}
      {contextMenuVisible && (
        <div
          style={{
            position: 'fixed',
            top: contextMenuPos.y,
            left: contextMenuPos.x,
            zIndex: 9999,
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          onMouseLeave={() => setContextMenuVisible(false)}
        >
          <Menu
            items={contextMenuItems}
            onClick={handleContextMenuClick}
            style={{ border: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default FlowEditor;
