import React from "react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const AreaChart: React.FC = () => {
  const series = [
    {
      name: "Sales",
      data: [13, 31, 45, 34, 23, 65, 23],
    },
    {
      name: "Rates",
      data: [9, 31, 94, 22, 23, 12, 23],
    },
    {
      name: "Customer",
      data: [21, 21, 11, 34, 43, 76, 23],
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: ["#4154f1", "#2eca6a", "#ff771d"],
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
      categories: ["Jan", "Feb", "Mar", "Apr", "May"],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    markers: {
      size: 4,
    },
  };

  return <Chart options={options} series={series} type="area" height={350} />;
};

export default AreaChart;
