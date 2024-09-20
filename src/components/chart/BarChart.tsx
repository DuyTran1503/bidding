import { useEffect } from "react";
import * as echarts from "echarts";

const BarChart = () => {
  useEffect(() => {
    const chartDom = document.querySelector("#bar-chart") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        tooltip: {},
        xAxis: {
          type: "category",
          data: ["Project A", "Project B", "Project C", "Project D"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Investment",
            type: "bar",
            data: [1200, 2320, 3010, 1540],
          },
        ],
      };

      myChart.setOption(option);
    }
  }, []);

  return <div id="bar-chart" className="echart min-h-[400px] w-full"></div>;
};

export default BarChart;
