import React, { useMemo, useRef, useState } from 'react';
import { Button, Card, ColorPicker, DatePicker, Divider, Form, Input, InputNumber, Modal, Radio, Select, Space, Switch, Upload } from 'antd';
import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

type FieldType = 'input' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'switch';
type LayoutType = 'grid' | 'flex';

interface RuleConfig { required?: boolean; pattern?: string; message?: string; custom?: string }
interface OptionItem { label: string; value: string }
interface FieldConfig { id: string; type: FieldType; field: string; label: string; span?: number; props?: Record<string, any>; options?: OptionItem[]; rules?: RuleConfig[] }
interface FormConfig { layout: LayoutType; gutter: number; cols: number; items: FieldConfig[] }

const palette: FieldConfig[] = [
  { id: 'p-input', type: 'input', field: '', label: '输入框', span: 12 },
  { id: 'p-textarea', type: 'textarea', field: '', label: '多行文本', span: 12 },
  { id: 'p-number', type: 'number', field: '', label: '数字', span: 12 },
  { id: 'p-select', type: 'select', field: '', label: '选择器', span: 12, options: [{ label: '选项A', value: 'A' }] },
  { id: 'p-radio', type: 'radio', field: '', label: '单选框', span: 12, options: [{ label: '是', value: '1' }, { label: '否', value: '0' }] },
  { id: 'p-checkbox', type: 'checkbox', field: '', label: '复选框', span: 12, options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }] },
  { id: 'p-date', type: 'date', field: '', label: '日期', span: 12 },
  { id: 'p-switch', type: 'switch', field: '', label: '开关', span: 12 },
];

const genId = () => Math.random().toString(36).slice(2, 9);

const componentRender = (cfg: FieldConfig) => {
  if (cfg.type === 'input') return <Input {...cfg.props} />;
  if (cfg.type === 'textarea') return <Input.TextArea {...cfg.props} />;
  if (cfg.type === 'number') return <InputNumber style={{ width: '100%' }} {...cfg.props} />;
  if (cfg.type === 'select') return <Select style={{ width: '100%' }} options={cfg.options} {...cfg.props} />;
  if (cfg.type === 'radio') return <Radio.Group options={cfg.options} {...cfg.props} />;
  if (cfg.type === 'checkbox') return <Select mode="multiple" style={{ width: '100%' }} options={cfg.options} {...cfg.props} />;
  if (cfg.type === 'date') return <DatePicker style={{ width: '100%' }} {...cfg.props} />;
  if (cfg.type === 'switch') return <Switch {...cfg.props} />;
  return null;
};

const toAntRules = (rules?: RuleConfig[]) => {
  if (!rules) return [] as any[];
  return rules.map(r => {
    const obj: any = {};
    if (r.required) obj.required = true;
    if (r.pattern) obj.pattern = new RegExp(r.pattern);
    if (r.message) obj.message = r.message;
    return obj;
  });
};

const FormRenderer: React.FC<{ config?: FieldConfig[] }> = ({ config = [] }) => {
  const [formCfg, setFormCfg] = useState<FormConfig>({ layout: 'grid', gutter: 16, cols: 24, items: [] });
  const [selected, setSelected] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [codeVisible, setCodeVisible] = useState(false);
  const [routeVisible, setRouteVisible] = useState(false);
  const [routeName, setRouteName] = useState('FormPage');
  const [routePath, setRoutePath] = useState('/form-page');
  const [template, setTemplate] = useState('form');

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  const initialItems = useMemo(() => config.map(c => ({ ...c, id: genId() })), [config]);
  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setFormCfg(prev => ({ ...prev, items: initialItems }));
    setInitialized(true);
  }

  const onPaletteDragStart = (item: FieldConfig, e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };
  const onCanvasDrop = (e: React.DragEvent) => {
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    const src = JSON.parse(data) as FieldConfig;
    const newItem: FieldConfig = { ...src, id: genId(), field: src.field || `field_${genId()}`, label: src.label || src.type };
    setFormCfg(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };
  const onCanvasDragOver = (e: React.DragEvent) => { e.preventDefault() };

  const onItemDragStart = (index: number, e: React.DragEvent) => { dragIndexRef.current = index };
  const onItemDragOver = (index: number, e: React.DragEvent) => { e.preventDefault() };
  const onItemDrop = (index: number, e: React.DragEvent) => {
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    const next = [...formCfg.items];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    setFormCfg(prev => ({ ...prev, items: next }));
    dragIndexRef.current = null;
  };

  const updateItem = (id: string, patch: Partial<FieldConfig>) => {
    setFormCfg(prev => ({ ...prev, items: prev.items.map(it => it.id === id ? { ...it, ...patch } : it) }));
  };
  const removeItem = (id: string) => { setFormCfg(prev => ({ ...prev, items: prev.items.filter(it => it.id !== id) })) };

  const exportJSON = () => {
    const json = JSON.stringify(formCfg, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'form-config.json';
    a.click();
  };
  const importJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setFormCfg(data);
      } catch {}
    };
    reader.readAsText(file);
    return false;
  };

  const genReactCode = () => {
    const lines: string[] = [];
    lines.push("import React from 'react'");
    lines.push("import { Form, Input, InputNumber, Select, Radio, Switch, DatePicker, Button, Row, Col } from 'antd'");
    lines.push('export default function GeneratedForm(){');
    lines.push('const [form] = Form.useForm()');
    lines.push('return (');
    lines.push('<Form form={form} layout="vertical">');
    if (formCfg.layout === 'grid') {
      lines.push(`<Row gutter={${formCfg.gutter}}>\n`);
      formCfg.items.forEach(it => {
        lines.push(`<Col span={${it.span || 12}}>\n`);
        lines.push(`<Form.Item label="${it.label}" name="${it.field}" rules={${JSON.stringify(toAntRules(it.rules))}}>\n`);
        const renderMap: Record<FieldType, string> = {
          input: '<Input />', textarea: '<Input.TextArea />', number: '<InputNumber style={{width:"100%"}} />',
          select: `<Select style={{width:"100%"}} options={${JSON.stringify(it.options || [])}} />`,
          radio: `<Radio.Group options={${JSON.stringify(it.options || [])}} />`,
          checkbox: `<Select mode="multiple" style={{width:"100%"}} options={${JSON.stringify(it.options || [])}} />`,
          date: '<DatePicker style={{width:"100%"}} />', switch: '<Switch />'
        };
        lines.push(renderMap[it.type]);
        lines.push('</Form.Item>\n');
        lines.push('</Col>\n');
      });
      lines.push('</Row>');
    } else {
      formCfg.items.forEach(it => {
        lines.push(`<Form.Item label="${it.label}" name="${it.field}" rules={${JSON.stringify(toAntRules(it.rules))}}>\n`);
        const renderMap: Record<FieldType, string> = {
          input: '<Input />', textarea: '<Input.TextArea />', number: '<InputNumber style={{width:"100%"}} />',
          select: `<Select style={{width:"100%"}} options={${JSON.stringify(it.options || [])}} />`,
          radio: `<Radio.Group options={${JSON.stringify(it.options || [])}} />`,
          checkbox: `<Select mode="multiple" style={{width:"100%"}} options={${JSON.stringify(it.options || [])}} />`,
          date: '<DatePicker style={{width:"100%"}} />', switch: '<Switch />'
        };
        lines.push(renderMap[it.type]);
        lines.push('</Form.Item>\n');
      });
    }
    lines.push('<Form.Item><Button type="primary" htmlType="submit">提交</Button></Form.Item>');
    lines.push('</Form>');
    lines.push(')');
    lines.push('}');
    return lines.join('\n');
  };

  const genVueCode = () => {
    const tpl: string[] = [];
    tpl.push('<template>');
    tpl.push('<div>');
    tpl.push('<form>');
    formCfg.items.forEach(it => { tpl.push(`<div><label>${it.label}</label><input /></div>`) });
    tpl.push('</form>');
    tpl.push('</div>');
    tpl.push('</template>');
    tpl.push('<script setup lang="ts">');
    tpl.push('const state = {}');
    tpl.push('</script>');
    return tpl.join('\n');
  };

  const downloadText = (name: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: 12, padding: 12,height:'800px',overflow:'auto'}}>
      <Card title="组件库" style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }} headStyle={{ position: 'sticky', top: 0, background: '#fff' }} bodyStyle={{ overflowY: 'auto', scrollBehavior: 'smooth', padding: 8 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {palette.map(p => (
            <div key={p.id} draggable onDragStart={(e) => onPaletteDragStart(p, e)} style={{ border: '1px dashed #e5e5e5', borderRadius: 6, padding: 8 }}>
              <div style={{ fontSize: 12, color: '#666' }}>{p.label}</div>
              <div>{componentRender(p)}</div>
            </div>
          ))}
        </Space>
        <Divider />
        <Space>
          <Upload accept="application/json" showUploadList={false} beforeUpload={importJSON}><Button icon={<UploadOutlined />}>导入JSON</Button></Upload>
          <Button icon={<DownloadOutlined />} onClick={exportJSON}>导出JSON</Button>
        </Space>
      </Card>

      <Card title="画布" style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }} headStyle={{ position: 'sticky', top: 0, background: '#fff' }} bodyStyle={{ overflowY: 'auto', scrollBehavior: 'smooth', padding: 8 }}>
        <Space style={{ marginBottom: 8 }}>
          <Select value={formCfg.layout} onChange={v => setFormCfg(prev => ({ ...prev, layout: v }))} options={[{ label: '栅格', value: 'grid' }, { label: '弹性', value: 'flex' }]} />
          <InputNumber addonBefore="gutter" min={0} max={32} value={formCfg.gutter} onChange={v => setFormCfg(prev => ({ ...prev, gutter: Number(v) || 0 }))} />
        </Space>
        <div ref={canvasRef} onDragOver={onCanvasDragOver} onDrop={onCanvasDrop} style={{ minHeight: 400, border: '1px dashed #e5e5e5', borderRadius: 8, padding: 8 }}>
          {formCfg.items.map((it, idx) => (
            <div key={it.id} draggable onDragStart={(e) => onItemDragStart(idx, e)} onDragOver={(e) => onItemDragOver(idx, e)} onDrop={(e) => onItemDrop(idx, e)} style={{ border: selected === it.id ? '1px solid #1890ff' : '1px solid #f0f0f0', borderRadius: 6, padding: 8, marginBottom: 8 }} onClick={() => setSelected(it.id)}>
              <Space style={{ marginBottom: 8 }}>
                <Input value={it.label} onChange={e => updateItem(it.id, { label: e.target.value })} placeholder="标签" style={{ width: 180 }} />
                <Input value={it.field} onChange={e => updateItem(it.id, { field: e.target.value })} placeholder="字段" style={{ width: 160 }} />
                <InputNumber min={1} max={24} value={it.span || 12} onChange={v => updateItem(it.id, { span: Number(v) || 12 })} />
                <Button danger onClick={() => removeItem(it.id)}>删除</Button>
              </Space>
              {componentRender(it)}
            </div>
          ))}
        </div>
        <Divider />
        <div style={{ position: 'sticky', bottom: 0, background: '#fff', padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
          <Space>
          <Button type="primary" onClick={() => setPreviewVisible(true)}>预览</Button>
          <Button onClick={() => setCodeVisible(true)}>生成代码</Button>
          <Button onClick={() => setRouteVisible(true)}>页面路由</Button>
        </Space>
        </div>
      </Card>

      <Card title="属性" style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }} headStyle={{ position: 'sticky', top: 0, background: '#fff' }} bodyStyle={{ overflowY: 'auto', scrollBehavior: 'smooth', padding: 8 }}>
        {(() => {
          const it = formCfg.items.find(i => i.id === selected);
          if (!it) return <div>选择一个组件进行编辑</div>;
          return (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Select value={it.type} onChange={v => updateItem(it.id, { type: v })} options={[{ value: 'input', label: '输入框' }, { value: 'textarea', label: '多行文本' }, { value: 'number', label: '数字' }, { value: 'select', label: '选择器' }, { value: 'radio', label: '单选框' }, { value: 'checkbox', label: '复选框' }, { value: 'date', label: '日期' }, { value: 'switch', label: '开关' }]} />
              {['select', 'radio', 'checkbox'].includes(it.type) && (
                <div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>选项</div>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {(it.options || []).map((op, idx) => (
                      <Space key={idx}>
                        <Input value={op.label} onChange={e => {
                          const next = [...(it.options || [])];
                          next[idx] = { ...op, label: e.target.value };
                          updateItem(it.id, { options: next });
                        }} placeholder="label" />
                        <Input value={op.value} onChange={e => {
                          const next = [...(it.options || [])];
                          next[idx] = { ...op, value: e.target.value };
                          updateItem(it.id, { options: next });
                        }} placeholder="value" />
                        <Button danger onClick={() => {
                          const next = [...(it.options || [])];
                          next.splice(idx, 1);
                          updateItem(it.id, { options: next });
                        }}>删除</Button>
                      </Space>
                    ))}
                    <Button icon={<PlusOutlined />} onClick={() => updateItem(it.id, { options: [ ...(it.options || []), { label: '选项', value: genId() } ] })}>添加选项</Button>
                  </Space>
                </div>
              )}
              <div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>校验</div>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <Switch checked={Boolean((it.rules || []).find(r => r.required))} onChange={v => {
                      const rules = [...(it.rules || [])].filter(r => !r.required);
                      if (v) rules.push({ required: true, message: '必填' });
                      updateItem(it.id, { rules });
                    }} />
                    <span>必填</span>
                  </Space>
                  <Input placeholder="正则" value={(it.rules || []).find(r => r.pattern)?.pattern || ''} onChange={e => {
                    const rules = [...(it.rules || [])].filter(r => !r.pattern);
                    if (e.target.value) rules.push({ pattern: e.target.value });
                    updateItem(it.id, { rules });
                  }} />
                  <Input placeholder="提示" value={(it.rules || []).find(r => r.message)?.message || ''} onChange={e => {
                    const rules = [...(it.rules || [])].filter(r => !r.message);
                    if (e.target.value) rules.push({ message: e.target.value });
                    updateItem(it.id, { rules });
                  }} />
                </Space>
              </div>
            </Space>
          );
        })()}
      </Card>

      <Modal open={previewVisible} onCancel={() => setPreviewVisible(false)} footer={null} width={800}>
        <Form layout="vertical">
          {formCfg.layout === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, Math.floor((formCfg.cols || 24)/12))}, 1fr)`, gap: formCfg.gutter }}>
              {formCfg.items.map(it => (
                <div key={it.id} style={{ gridColumn: `span ${Math.max(1, Math.round((it.span || 12)/12))}` }}>
                  <Form.Item label={it.label} name={it.field} rules={toAntRules(it.rules)}>
                    {componentRender(it)}
                  </Form.Item>
                </div>
              ))}
            </div>
          ) : (
            formCfg.items.map(it => (
              <Form.Item key={it.id} label={it.label} name={it.field} rules={toAntRules(it.rules)}>
                {componentRender(it)}
              </Form.Item>
            ))
          )}
          <Form.Item><Button type="primary">提交</Button></Form.Item>
        </Form>
      </Modal>

      <Modal open={codeVisible} onCancel={() => setCodeVisible(false)} footer={null} width={900}>
        <Space>
          <Button onClick={() => downloadText('GeneratedForm.tsx', genReactCode())}>下载React代码</Button>
          <Button onClick={() => downloadText('GeneratedForm.vue', genVueCode())}>下载Vue代码</Button>
        </Space>
        <Divider />
        <pre style={{ maxHeight: 480, overflow: 'auto' }}>{genReactCode()}</pre>
      </Modal>

      <Modal open={routeVisible} onCancel={() => setRouteVisible(false)} footer={null} width={700}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input addonBefore="名称" value={routeName} onChange={e => setRouteName(e.target.value)} />
          <Input addonBefore="路径" value={routePath} onChange={e => setRoutePath(e.target.value)} />
          <Select value={template} onChange={setTemplate} options={[{ value: 'blank', label: '空白页' }, { value: 'form', label: '表单页' }, { value: 'list', label: '列表页' }]} />
          <Button onClick={() => {
            const routeCode = `{
  path: '${routePath.replace(/^\//,'')}',
  element: (
    <BasicLayout>
      <${template==='form'?'GeneratedForm':routeName} />
    </BasicLayout>
  )
}`;
            downloadText('route-snippet.txt', routeCode);
          }}>下载路由片段</Button>
        </Space>
      </Modal>
    </div>
  );
};

export default FormRenderer;
