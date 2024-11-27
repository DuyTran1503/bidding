import React, { useEffect } from 'react';
import * as echarts from 'echarts/core';
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

// Define the types for the props
interface BarChartProps {
  categories: string[]; // Labels for the X-axis
  legendData?: string[]; // Labels for the legend
  seriesData: {
    name: string;
    data: number[];
  }[]; // Data for each series
}

const AbleBarChart: React.FC<BarChartProps> = ({ categories, seriesData, legendData }) => {
  useEffect(() => {
    const chartDom = document.getElementById('main') as HTMLElement;
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: legendData,
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: categories,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: seriesData.map(item => ({
        ...item,
        type: 'bar',
        label: {
          show: true,
          position: 'insideBottom',
          distance: 15,
          align: 'left',
          verticalAlign: 'middle',
          rotate: 90,
          formatter: '{c}  {name|{a}}',
          fontSize: 16,
          rich: {
            name: {},
          },
        },
        emphasis: {
          focus: 'series',
        },
      })),
    };

    myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, [categories, seriesData, legendData]);

  return <div id="main" style={{ width: '100%', height: '400px' }}></div>;
};

export default AbleBarChart;
