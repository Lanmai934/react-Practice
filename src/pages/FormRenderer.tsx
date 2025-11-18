import React from 'react';
import { Input, Select, DatePicker } from 'antd';


const FormItemConfig={
    type:'input' as 'input' | 'select' | 'date',
    field:'',
    label:'',
    props:{}
}



// 表单渲染器组件
const FormRenderer: React.FC<{ config?: typeof FormItemConfig[] }> = ({ config = [] }) => {

    const componentMap = {
    input: Input,
    select: Select,
    date: DatePicker,
    };


  return (
    <div style={{ padding: 24 }}>
      <h2>表单渲染器</h2>
      {/* 后续可在此扩展动态表单逻辑 */}
     <form>
        {config.map(item => {
            const Component = componentMap[item.type];
            return (
            <div key={item.field}>
                <label>{item.label}</label>
                {React.createElement(Component as any, item.props)}
            </div>
            );
        })}
    </form>
    </div>
  );
};

export default FormRenderer;
