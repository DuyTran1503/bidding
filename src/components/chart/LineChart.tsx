import { useEffect } from "react";
import * as echarts from "echarts";

const LineChart = () => {
  useEffect(() => {
    const chartDom = document.querySelector("#line-chart") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["Q1", "Q2", "Q3", "Q4"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Budget",
            type: "line",
            data: [1200, 1400, 1600, 2000],
          },
        ],
      };

      myChart.setOption(option);
    }
  }, []);

  return <div id="line-chart" className="echart min-h-[400px]"></div>;
};

export default LineChart;
