import { useEffect } from "react";
import * as echarts from "echarts";

const RadarChart = () => {
  useEffect(() => {
    const chartDom = document.querySelector("#radar-chart") as HTMLElement; // Chuyển đổi kiểu
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        legend: {
          data: ["Allocated Budget", "Actual Spending"],
        },
        radar: {
          shape: "circle",
          indicator: [
            { name: "Sales", max: 6500 },
            { name: "MKT", max: 6644 },
            { name: "IT", max: 5000 },
            { name: "Logistics", max: 6000 },
            { name: "BOSS", max: 5500 },
          ],
        },
        series: [
          {
            name: "Budget vs Spending",
            type: "radar",
            data: [
              {
                value: [4200, 3000, 2000, 3500, 5000],
                name: "Allocated Budget",
              },
              {
                value: [5000, 1400, 2800, 2600, 4200],
                name: "Actual Spending",
              },
            ],
          },
        ],
      };

      myChart.setOption(option);
    }
  }, []);

  return <div id="radar-chart" className="echart min-h-[400px]"></div>;
};

export default RadarChart;
