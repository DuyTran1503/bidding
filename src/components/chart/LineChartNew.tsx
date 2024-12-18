import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { LEVELTASK, mappingLevelTask } from '@/shared/enums/level';

interface DataItem {
  project: string;
  easy: number;
  medium: number;
  hard: number;
  very_hard: number;
  [key: string]: string | number; // For any additional properties
}

interface BarChartProps {
  data: (DataItem | string[])[];
  height?: string;
  width?: string;
}

const transformData = (rawData: (DataItem | string[])[]) => {
  if (!rawData || rawData.length === 0) return [];
  
  const transformedData: (string | number)[][] = [];
  const headers = rawData[0] as string[];
  const mappedHeaders = headers.map(header => 
    mappingLevelTask[header as LEVELTASK] || header // Sử dụng mappingLevelTask nếu có, hoặc giữ nguyên
  );

  transformedData.push(mappedHeaders);

  
  for (let i = 1; i < rawData.length; i++) {
    const item = rawData[i] as DataItem;
    const row = [
      item.project,
      item.easy,
      item.medium,
      item.hard,
      item.very_hard
    ];
    transformedData.push(row);
  }
  
  return transformedData;
};

const calculateBarWidth = (length: number) => {
  if (length <= 10) return 30; // Maximum width
  if (length <= 20) return 30 - (length - 10) * (15 / 10); // Gradually reduce
  return 15; // Minimum width
};

const LineChartNew: React.FC<BarChartProps> = ({ 
  data, 
  height = '500px', 
  width = '100%' 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    chartInstance.current = echarts.init(chartRef.current);
    
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;

    const transformedData = transformData(data);

    const barWidth = calculateBarWidth(transformedData.length); // Calculate dynamic barWidth
    
    const option: echarts.EChartsOption = {
      legend: {},
      tooltip: {},
      dataset: {
        source: transformedData
      },
      xAxis: { 
        type: 'category',
        axisLabel: {
          rotate: 0,
          overflow: 'break',
          fontSize: 12
        }
      },
      yAxis: {},
      series: [
        { 
          type: 'bar',
          barWidth,  // Use dynamic barWidth
          barGap: '30%'
        }, 
        { 
          type: 'bar',
          barWidth,
          barGap: '30%'
        }, 
        { 
          type: 'bar',
          barWidth,
          barGap: '30%'
        }, 
        { 
          type: 'bar',
          barWidth,
          barGap: '30%'
        }
      ]
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width, 
        height,
        minHeight: '300px'
      }} 
    />
  );
};

export default LineChartNew;