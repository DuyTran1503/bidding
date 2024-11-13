import React from "react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

interface AreaChartProps {
  series: { name: string; data: number[] }[]; // Dữ liệu cho từng dòng trong biểu đồ
  categories: string[]; // Các nhãn trên trục x
  height?: number; // Chiều cao của biểu đồ, tùy chọn
  colors?: string[]; // Màu sắc cho từng dòng
  title?: string; // Tiêu đề biểu đồ, tùy chọn
}

const AreaChart: React.FC<AreaChartProps> = ({ 
  series, 
  categories, 
  height = 350, 
  colors = ["#4154f1", "#2eca6a", "#ff771d"], 
  title 
}) => {
  const options: ApexOptions = {
    chart: {
      type: "area",
      height,
      toolbar: {
        show: false,
      },
    },
    colors,
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "category",
      categories,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    markers: {
      size: 4,
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
      }
    }
  };

  return <Chart options={options} series={series} type="area" height={height} />;
};

export default AreaChart;
