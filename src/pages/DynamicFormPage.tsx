import React from 'react'
import { Form, Input, InputNumber, Select, Radio, Switch, DatePicker, Button } from 'antd'

type FieldType = 'input' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'switch'
interface RuleConfig { required?: boolean; pattern?: string; message?: string }
interface OptionItem { label: string; value: string }
interface FieldConfig { id: string; type: FieldType; field: string; label: string; span?: number; props?: Record<string, any>; options?: OptionItem[]; rules?: RuleConfig[] }
interface FormConfig { layout: 'grid' | 'flex'; gutter: number; cols: number; items: FieldConfig[] }

const componentRender = (cfg: FieldConfig) => {
  if (cfg.type === 'input') return <Input {...cfg.props} />
  if (cfg.type === 'textarea') return <Input.TextArea {...cfg.props} />
  if (cfg.type === 'number') return <InputNumber style={{ width: '100%' }} {...cfg.props} />
  if (cfg.type === 'select') return <Select style={{ width: '100%' }} options={cfg.options} {...cfg.props} />
  if (cfg.type === 'radio') return <Radio.Group options={cfg.options} {...cfg.props} />
  if (cfg.type === 'checkbox') return <Select mode="multiple" style={{ width: '100%' }} options={cfg.options} {...cfg.props} />
  if (cfg.type === 'date') return <DatePicker style={{ width: '100%' }} {...cfg.props} />
  if (cfg.type === 'switch') return <Switch {...cfg.props} />
  return null
}

const toAntRules = (rules?: RuleConfig[]) => {
  if (!rules) return [] as any[]
  return rules.map(r => {
    const obj: any = {}
    if (r.required) obj.required = true
    if (r.pattern) obj.pattern = new RegExp(r.pattern)
    if (r.message) obj.message = r.message
    return obj
  })
}

export default function DynamicFormPage(){
  const raw = localStorage.getItem('form-config')
  const formCfg: FormConfig = raw ? JSON.parse(raw) : { layout: 'grid', gutter: 16, cols: 24, items: [] }
  const [form] = Form.useForm()
  return (
    <div style={{ padding: 16 }}>
      <Form form={form} layout="vertical">
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
        <Form.Item><Button type="primary" htmlType="submit">提交</Button></Form.Item>
      </Form>
    </div>
  )
}
