import React, { useEffect, useRef } from 'react';
import { Card, Row, Col, DatePicker } from 'antd';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;

const Reports: React.FC = () => {
  const areaChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 销售趋势图
    if (areaChartRef.current) {
      const chart = echarts.init(areaChartRef.current);
      chart.setOption({
        title: {
          text: '销售趋势'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [3500, 4200, 3800, 5000, 4800, 6000],
          type: 'line',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24,144,255,0.3)' },
              { offset: 1, color: 'rgba(24,144,255,0.1)' }
            ])
          },
          smooth: true,
          lineStyle: {
            color: '#1890ff'
          },
          itemStyle: {
            color: '#1890ff'
          }
        }]
      });
    }

    // 产品销量图
    if (barChartRef.current) {
      const chart = echarts.init(barChartRef.current);
      chart.setOption({
        title: {
          text: '产品销量'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['产品A', '产品B', '产品C', '产品D', '产品E']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [38, 52, 61, 45, 48],
          type: 'bar',
          itemStyle: {
            color: '#1890ff'
          }
        }]
      });
    }

    // 用户分布图
    if (pieChartRef.current) {
      const chart = echarts.init(pieChartRef.current);
      chart.setOption({
        title: {
          text: '用户分布'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [{
          type: 'pie',
          radius: '70%',
          data: [
            { value: 35, name: '华东' },
            { value: 25, name: '华北' },
            { value: 20, name: '华南' },
            { value: 15, name: '西部' },
            { value: 5, name: '其他' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      });
    }

    // 清理函数
    return () => {
      if (areaChartRef.current) {
        echarts.getInstanceByDom(areaChartRef.current)?.dispose();
      }
      if (barChartRef.current) {
        echarts.getInstanceByDom(barChartRef.current)?.dispose();
      }
      if (pieChartRef.current) {
        echarts.getInstanceByDom(pieChartRef.current)?.dispose();
      }
    };
  }, []);

  // 窗口大小改变时重新调整图表大小
  useEffect(() => {
    const handleResize = () => {
      [areaChartRef, barChartRef, pieChartRef].forEach(ref => {
        if (ref.current) {
          echarts.getInstanceByDom(ref.current)?.resize();
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Card 
        title="数据报表" 
        extra={
          <RangePicker 
            style={{ width: 250 }} 
            placeholder={['开始日期', '结束日期']}
          />
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <div ref={areaChartRef} style={{ height: 300 }} />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <Card>
              <div ref={barChartRef} style={{ height: 300 }} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <div ref={pieChartRef} style={{ height: 300 }} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Reports; 