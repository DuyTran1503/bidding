import { useEffect } from "react";
import * as echarts from "echarts";

const PieChart = () => {
  useEffect(() => {
    const chartDom = document.querySelector("#pie-chart") as HTMLElement; // Chuyển đổi kiểu
    if (chartDom) {
      const myChart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
          },
        ],
      };

      myChart.setOption(option);
    }
  }, []);

  return <div id="pie-chart" className="echart min-h-[400px]"></div>;
};

export default PieChart;
