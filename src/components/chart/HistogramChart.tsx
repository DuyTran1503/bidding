import { useEffect } from "react";
import * as echarts from "echarts";

const Histogram = () => {
  useEffect(() => {
    const chartDom = document.querySelector("#histogram") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        tooltip: {},
        xAxis: {
          type: "category",
          data: ["0-10", "10-20", "20-30", "30-40", "40-50"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Frequency",
            type: "bar",
            data: [5, 15, 25, 10, 20],
          },
        ],
      };

      myChart.setOption(option);
    }
  }, []);

  return <div id="histogram" className="echart min-h-[400px]"></div>;
};

export default Histogram;
