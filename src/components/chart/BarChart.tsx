import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface BarChartProps {
  name?: string[];
  value?: number[];
  seriesName?: string;
  barColor?: string;
  tooltipEnabled?: boolean;
  chartHeight?: number;
  chartWidth?: string;
  nameChart: string;
}

const BarChart: React.FC<BarChartProps> = ({
  name = [],
  value = [],
  seriesName = "Investment",
  barColor = "#5470C6",
  tooltipEnabled = true,
  chartHeight = 400,
  chartWidth = "100%",
  nameChart,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        tooltip: {
          show: tooltipEnabled,
        },
        xAxis: {
          type: "category",
          data: name,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: seriesName,
            type: "bar",
            data: value,
            itemStyle: {
              color: barColor,
            },
          },
        ],
      };

      myChart.setOption(option);

      // Xử lý cleanup để giải phóng tài nguyên khi component unmount
      return () => {
        myChart.dispose();
      };
    }
  }, [name, value, seriesName, barColor, tooltipEnabled]);

  return <>
    <h2 className="w-full text-center text-2xl font-bold">{nameChart}</h2>
    <div ref={chartRef} style={{ minHeight: chartHeight, width: chartWidth }}></div>
  </>;
};

export default BarChart;
