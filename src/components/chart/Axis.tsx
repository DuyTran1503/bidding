import React, { useMemo, useRef, useState } from "react";
import * as echarts from "echarts";

const posList = [
  "left",
  "right",
  "top",
  "bottom",
  "inside",
  "insideTop",
  "insideLeft",
  "insideRight",
  "insideBottom",
  "insideTopLeft",
  "insideTopRight",
  "insideBottomLeft",
  "insideBottomRight",
] as const;

interface AbleBarChartProps {
  data: {
    name: string;
    values?: number[];
  }[];
  xAxisData: string[];
  title: string;
}

type AlignOptions = "left" | "center" | "right";
type VerticalAlignOptions = "top" | "middle" | "bottom";
type PositionOptions = (typeof posList)[number];
type BarLabelOption = NonNullable<echarts.BarSeriesOption["label"]>;
const AbleBarChart: React.FC<AbleBarChartProps> = ({ data, title, xAxisData }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const computedBarWidth = data.map((item) => item.name) && data.map((item) => item.name).length < 3 ? 45 : 0;
  const [config, setConfig] = useState({
    rotate: 90,
    align: "left" as AlignOptions,
    verticalAlign: "middle" as VerticalAlignOptions,
    position: "insideBottom" as PositionOptions,
    distance: 15,
  });

  const [showControls, setShowControls] = useState(false);

  useMemo(() => {
    if (!chartRef.current) return;

    // Kiểm tra xem chartInstance đã được khởi tạo chưa
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const myChart = chartInstance.current;

    const labelOption: BarLabelOption = {
      show: true,
      position: config.position,
      distance: config.distance,
      align: config.align,
      verticalAlign: config.verticalAlign,
      rotate: config.rotate,
      fontSize: 13,
      formatter: (params) => {
        // Dùng toán tử optional chaining và thay thế undefined bằng chuỗi rỗng
        const truncatedName = (params.seriesName ?? "").length > 30 ? (params.seriesName ?? "").substring(0, 30) + "..." : params.seriesName ?? "";
        return `${params.value}  ${truncatedName}`; // Hiển thị giá trị và tên đã cắt ngắn
      },
      rich: { name: {} },
    };

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      title: {
        text: title,
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          fontFamily: "Arial, Helvetica, sans-serif",
        },
      },
      legend: {
        data: data.map((item) => item.name),
        top: "bottom",
        type: "scroll",
        orient: "horizontal", // Đặt hướng ngang để legend nằm ở phía dưới
        left: "center",
      },
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["line", "bar", "stack"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: "category",
          data: xAxisData,
          axisTick: { show: false },
        },
      ],
      yAxis: [
        {
          type: "value",
          max: 100,
        },
      ],
      series: data.map((seriesData) => ({
        name: seriesData.name,
        type: "bar",
        data: seriesData.values,
        barWidth: computedBarWidth,
        label: labelOption,
        emphasis: {
          focus: "series",
        },
        barGap: 0,
      })),
    };

    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose(); // Chỉ gọi dispose nếu bạn muốn giải phóng tài nguyên
      chartInstance.current = null; // Reset instance
    };
  }, [data, xAxisData, title, config]);

  return (
    <div className="required relative">
      <button onClick={() => setShowControls(!showControls)} className="rounded bg-black-500 px-4 py-2 text-white shadow-md">
        {showControls ? "Close Controls" : "Open Controls"}
      </button>
      <div className="h-[500px] w-full" ref={chartRef}></div>

      {showControls && (
        <div
          className={`absolute left-0 top-12 w-[300px] transform space-y-4 rounded-lg bg-black-500 p-4 text-white shadow-md transition-all duration-300 ease-in-out ${
            showControls ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
          }`}
        >
          <h4 className="text-center font-semibold">Chart Controls</h4>
          <label className="flex items-center justify-between">
            Rotate:
            <input
              type="range"
              min="-90"
              max="90"
              value={config.rotate}
              onChange={(e) => setConfig({ ...config, rotate: parseInt(e.target.value) })}
              className="w-36"
            />
          </label>
          <label className="flex items-center justify-between">
            Align:
            <select
              value={config.align}
              onChange={(e) => setConfig({ ...config, align: e.target.value as AlignOptions })}
              className="w-36 rounded bg-white text-black-500"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <label className="flex items-center justify-between">
            Vertical Align:
            <select
              value={config.verticalAlign}
              onChange={(e) =>
                setConfig({
                  ...config,
                  verticalAlign: e.target.value as VerticalAlignOptions,
                })
              }
              className="w-36 rounded bg-white text-black-500"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </select>
          </label>
          <label className="flex items-center justify-between">
            Position:
            <select
              value={config.position}
              onChange={(e) =>
                setConfig({
                  ...config,
                  position: e.target.value as PositionOptions,
                })
              }
              className="w-36 rounded bg-white text-black-500"
            >
              {posList.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center justify-between">
            Distance:
            <input
              type="range"
              min="0"
              max="100"
              value={config.distance}
              onChange={(e) => setConfig({ ...config, distance: parseInt(e.target.value) })}
              className="w-36"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default AbleBarChart;
