import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Space, Form, Input, Select, Divider, message } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, CompressOutlined, SaveOutlined, UndoOutlined, RedoOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Graph as X6Graph } from '@antv/x6';

const FlowEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [graph, setGraph] = useState<X6Graph | null>(null);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const g = new X6Graph({
      container: containerRef.current!,
      grid: { size: 10, visible: true },
      panning: true,
      mousewheel: { enabled: true, modifiers: ['ctrl'] },
      selecting: { enabled: true, multiple: true, rubberband: true },
      connecting: {
        allowLoop: false,
        allowNode: true,
        allowEdge: false,
        highlight: true,
        snap: true,
        anchor: 'center',
        connectionPoint: 'boundary',
        validateConnection({ sourceCell, targetCell }) {
          if (!sourceCell || !targetCell) return false;
          if (sourceCell.id === targetCell.id) return false;
          return true;
        }
      },
      history: true,
      keyboard: true
    });

    g.on('cell:selected', ({ cell }) => {
      setSelectedCellId(cell.id);
      const label = cell.isEdge() ? cell.attr('label/text') : cell.attr('label/text');
      const type = cell.isEdge() ? 'edge' : 'node';
      form.setFieldsValue({ label: label || '', type });
    });

    g.on('selection:changed', ({ selected }) => {
      if (selected.length === 0) {
        setSelectedCellId(null);
        form.resetFields();
      }
    });

    const start = g.addNode({
      x: 80,
      y: 80,
      width: 120,
      height: 40,
      label: '开始',
      shape: 'rect',
      attrs: { body: { fill: '#E6F7FF', stroke: '#1890ff' }, label: { fill: '#1890ff' } },
      ports: {
        groups: {
          top: { position: 'top', attrs: { circle: { r: 4, magnet: true, stroke: '#1890ff', strokeWidth: 2, fill: '#fff' } } },
          right: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke: '#1890ff', strokeWidth: 2, fill: '#fff' } } },
          bottom: { position: 'bottom', attrs: { circle: { r: 4, magnet: true, stroke: '#1890ff', strokeWidth: 2, fill: '#fff' } } },
          left: { position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#1890ff', strokeWidth: 2, fill: '#fff' } } }
        },
        items: [
          { group: 'right' },
          { group: 'bottom' }
        ]
      }
    });

    const task = g.addNode({
      x: 300,
      y: 80,
      width: 140,
      height: 50,
      label: '任务',
      shape: 'rect',
      attrs: { body: { fill: '#FFFBE6', stroke: '#FAAD14' }, label: { fill: '#FAAD14' } },
      ports: {
        groups: {
          top: { position: 'top', attrs: { circle: { r: 4, magnet: true, stroke: '#FAAD14', strokeWidth: 2, fill: '#fff' } } },
          right: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke: '#FAAD14', strokeWidth: 2, fill: '#fff' } } },
          bottom: { position: 'bottom', attrs: { circle: { r: 4, magnet: true, stroke: '#FAAD14', strokeWidth: 2, fill: '#fff' } } },
          left: { position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#FAAD14', strokeWidth: 2, fill: '#fff' } } }
        },
        items: [
          { group: 'top' },
          { group: 'right' },
          { group: 'bottom' },
          { group: 'left' }
        ]
      }
    });

    g.addEdge({
      source: start,
      target: task,
      attrs: { line: { stroke: '#999', targetMarker: 'classic' }, label: { text: '' } }
    });

    setGraph(g);
    return () => {
      g.dispose();
    };
  }, [form]);

  const handleZoomIn = () => graph && graph.zoom(0.1);
  const handleZoomOut = () => graph && graph.zoom(-0.1);
  const handleFit = () => graph && graph.zoomToFit({ padding: 20 });
  const handleUndo = () => graph && graph.undo();
  const handleRedo = () => graph && graph.redo();
  const handleSave = () => {
    if (!graph) return;
    const data = graph.toJSON();
    localStorage.setItem('flowchart', JSON.stringify(data));
    message.success('已保存');
  };
  const handleLoad = () => {
    if (!graph) return;
    const raw = localStorage.getItem('flowchart');
    if (!raw) return;
    const data = JSON.parse(raw);
    graph.fromJSON(data);
    message.success('已加载');
  };

  const [placingType, setPlacingType] = useState<'start' | 'task' | 'decision' | 'end' | null>(null);

  const createNode = (type: 'start' | 'task' | 'decision' | 'end') => {
    if (!graph) return null;
    if (type === 'start') {
      return graph.createNode({ width: 120, height: 40, label: '开始', shape: 'rect', attrs: { body: { fill: '#E6F7FF', stroke: '#1890ff' }, label: { fill: '#1890ff' } } });
    }
    if (type === 'task') {
      return graph.createNode({ width: 140, height: 50, label: '任务', shape: 'rect', attrs: { body: { fill: '#FFFBE6', stroke: '#FAAD14' }, label: { fill: '#FAAD14' } } });
    }
    if (type === 'decision') {
      return graph.createNode({ width: 140, height: 60, label: '条件', shape: 'polygon', points: '0,30 70,0 140,30 70,60', attrs: { body: { fill: '#F6FFED', stroke: '#52C41A' }, label: { fill: '#52C41A' } } });
    }
    return graph.createNode({ width: 120, height: 40, label: '结束', shape: 'rect', attrs: { body: { fill: '#FFF0F6', stroke: '#EB2F96' }, label: { fill: '#EB2F96' } } });
  };

  useEffect(() => {
    if (!graph) return;
    const handler = ({ x, y }: { x: number; y: number }) => {
      if (!placingType) return;
      const node = createNode(placingType);
      if (!node) return;
      node.position(x - node.size().width / 2, y - node.size().height / 2);
      graph.addNode(node);
      setPlacingType(null);
    };
    graph.on('blank:click', handler);
    return () => {
      graph.off('blank:click', handler as any);
    };
  }, [graph, placingType]);

  const handleFormFinish = (values: { label?: string; type?: 'node' | 'edge' }) => {
    if (!graph || !selectedCellId) return;
    const cell = graph.getCellById(selectedCellId);
    if (!cell) return;
    if (cell.isEdge()) {
      cell.attr('label/text', values.label || '');
    } else {
      cell.attr('label/text', values.label || '');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Card style={{ width: 240 }} title="组件库">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button icon={<PlusSquareOutlined />} type={placingType==='start'?'primary':'default'} onClick={() => setPlacingType('start')}>开始</Button>
          <Button icon={<PlusSquareOutlined />} type={placingType==='task'?'primary':'default'} onClick={() => setPlacingType('task')}>任务</Button>
          <Button icon={<PlusSquareOutlined />} type={placingType==='decision'?'primary':'default'} onClick={() => setPlacingType('decision')}>条件</Button>
          <Button icon={<PlusSquareOutlined />} type={placingType==='end'?'primary':'default'} onClick={() => setPlacingType('end')}>结束</Button>
        </Space>
        <Divider />
        <Space>
          <Button icon={<UndoOutlined />} onClick={handleUndo}>撤销</Button>
          <Button icon={<RedoOutlined />} onClick={handleRedo}>重做</Button>
        </Space>
        <Space style={{ marginTop: 8 }}>
          <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut}>缩小</Button>
          <Button icon={<ZoomInOutlined />} onClick={handleZoomIn}>放大</Button>
          <Button icon={<CompressOutlined />} onClick={handleFit}>适配</Button>
        </Space>
        <Space style={{ marginTop: 8 }}>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
          <Button onClick={handleLoad}>加载</Button>
        </Space>
      </Card>
      <Card style={{ flex: 1 }}>
        <div ref={containerRef} style={{ height: 600, background: '#fff' }} />
      </Card>
      <Card style={{ width: 300 }} title="属性">
        <Form layout="vertical" form={form} onFinish={handleFormFinish}>
          <Form.Item name="type" label="类型">
            <Select options={[{ label: '节点', value: 'node' }, { label: '边', value: 'edge' }]} disabled />
          </Form.Item>
          <Form.Item name="label" label="名称">
            <Input placeholder="输入名称" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">应用</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FlowEditor;
