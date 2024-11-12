import React, { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";

interface GenericChartProps {
  name?: string[]; // Mảng tên hoặc nhãn cho mỗi điểm dữ liệu trên biểu đồ.
  value?: (number | string)[]; // Mảng giá trị tương ứng với mỗi tên trong biểu đồ.
  seriesName?: string; // Tên cho chuỗi dữ liệu, hữu ích cho biểu đồ nhiều chuỗi.
  chartType: "bar" | "line" | "pie" | "area" | "radar"; // Loại biểu đồ cần hiển thị.
  colors?: string[]; // Mảng màu để tùy chỉnh màu sắc cho các điểm dữ liệu hoặc chuỗi.
  tooltipEnabled?: boolean; // Bật hoặc tắt tooltip cho các điểm dữ liệu.
  height?: string; // Chiều cao của biểu đồ, đơn vị là pixel.
  width?: string; // Chiều rộng của biểu đồ, ví dụ: "100%" hoặc cụ thể theo pixel.
  title?: string; // Tiêu đề hiển thị trên đầu biểu đồ.
  legendPosition?: "top" | "bottom" | "left" | "right"; // Vị trí và hiển thị ghi chú trên biểu đồ.
  animationDuration?: number; // Thời lượng hiệu ứng chuyển động của biểu đồ, tính theo mili giây.
  labelFontSize?: number; // Kích thước chữ cho các nhãn hiển thị trên biểu đồ.
  barWidth?: number; // Độ rộng của các cột trong biểu đồ cột (chỉ áp dụng cho biểu đồ cột).
  valueType?: "currency" | "quantity" | "date"; // Loại giá trị để hiển thị: giá, số lượng hoặc ngày.
  rotate?: number; // Góc nghiêng khi thấy tên nó bị dài.
  grid?: number; // Điều khiển khoảng cách từ name tới biểu đồ, phù hợp cho cái nào cần cho cái nào có name dài và phải để nghiêng.
  titleFontSize?: number;
  series?: {
    name: string;
    data: (number | string)[];
    color?: string;
  }[];
}
const fixedColors = [
  "#5470c6",
  "#91cc75",
  "#fac858",
  "#ee6666",
  "#73c0de",
  "#3ba272",
  "#fc8452",
  "#9a60b4",
  "#ea7ccc",
  // "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300", "#DAF7A6",
  // "#581845", "#C70039", "#900C3F", "#33FFBD", "#FF8C33",
  // "#8D33FF", "#33A1FF", "#57FF33", "#FFE933", "#F1C40F", "#2980B9",
  // "#2ECC71", "#E74C3C", "#34495E", "#7D3C98", "#27AE60", "#E67E22",
  // "#16A085", "#D35400", "#C0392B", "#8E44AD", "#F39C12", "#2C3E50"
];
const GenericChart: React.FC<GenericChartProps> = ({
  name,
  value,
  seriesName,
  series,
  chartType,
  colors = fixedColors,
  tooltipEnabled = true,
  title,
  legendPosition,
  animationDuration,
  labelFontSize = 12,
  titleFontSize = 16,
  barWidth,
  grid = 80,
  valueType = "quantity", // Mặc định là số lượng
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const computedRotate = name && name.length > 5 ? 45 : 0;
  const computedBarWidth = name && name.length < 15 ? 45 : 0;

  // Hàm định dạng số với dấu phẩy và đơn vị, làm tròn theo đơn vị khi hiển thị trên biểu đồ
  const formatNumber = (num: number) => {
    if (num >= 1e18) return new Intl.NumberFormat("vi-VN").format(num / 1e18) + " tỷ tỷ";
    if (num >= 1e15) return new Intl.NumberFormat("vi-VN").format(num / 1e15) + " triệu tỷ";
    if (num >= 1e12) return new Intl.NumberFormat("vi-VN").format(num / 1e12) + " nghìn tỷ";
    if (num >= 1e9) return new Intl.NumberFormat("vi-VN").format(num / 1e9) + " tỷ";
    if (num >= 1e6) return new Intl.NumberFormat("vi-VN").format(num / 1e6) + " triệu";
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  // Hàm định dạng số cho các giá trị khác
  const formatValue = (val: number | string) => {
    if (valueType === "currency") {
      return formatNumber(Number(val));
    } else if (valueType === "date") {
      return `${val} ngày`;
    } else {
      return new Intl.NumberFormat("vi-VN").format(Number(val));
    }
  };

  const option = useMemo(() => {
    const seriesData =
      chartType === "pie"
        ? name?.map((n, i) => ({ name: n, value: value?.[i], itemStyle: { color: colors[i % colors.length] } }))
        : value?.map((v, i) => ({ value: v, itemStyle: { color: colors[i] } }));

    return {
      tooltip: {
        show: tooltipEnabled,
        formatter: (params: any) => {
          const formattedValue =
            valueType === "currency"
              ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(params.value)
              : new Intl.NumberFormat("vi-VN").format(params.value);
          if (chartType === "pie") {
            return `${params.name}: ${formattedValue} (${params.percent}%)`;
          }
          return `${params.name}: ${formattedValue}`;
        },
      },
      title: {
        text: title,
        left: "center",
        textStyle: {
          fontSize: titleFontSize, // Điều chỉnh kích thước tiêu đề ở đây
          fontWeight: "bold",
        },
      },
      legend: legendPosition
        ? {
            [legendPosition]: "0%",
            itemGap: 10,
            textStyle: {
              fontSize: 10, // Thay đổi kích thước của legend tại đây
            },
            type: "scroll",
            orient: "horizontal", // Đặt hướng ngang để legend nằm ở phía dưới
            left: "center",
          }
        : undefined,
      xAxis:
        chartType !== "pie"
          ? {
              type: "category",
              data: name,
              axisLabel: {
                interval: 0,
                rotate: computedRotate,
                verticalAlign: "top",
                overflow: "truncate",
                formatter: (value: string) => (name && name.length > 4 && value.length > 20 ? value.substring(0, 20) + "..." : value),
              },
            }
          : undefined,
      yAxis:
        chartType !== "pie"
          ? {
              type: "value",
              axisLabel: {
                formatter: (value: number) => formatValue(value),
              },
            }
          : undefined,
      grid: {
        bottom: grid,
      },
      series:
        chartType === "area" && Array.isArray(series)
          ? series.map((s, index) => ({
              name: s.name,
              type: "line",
              data: s.data,
              smooth: true,
              areaStyle: {},
              itemStyle: { color: s.color || colors[index % colors.length] },
            }))
          : [
              {
                colors: chartType === "pie" ? colors : undefined,
                name: seriesName,
                type: chartType,
                data: seriesData,
                barWidth: computedBarWidth,
                smooth: chartType === "line",
                label: {
                  show: true,
                  fontSize: labelFontSize,
                  grid: {
                    bottom: grid,
                  },
                  formatter: (params: any) => {
                    if (chartType === "pie") {
                      return `${params.name}: ${params.percent}%`;
                    }
                    return formatValue(params.value);
                  },
                  position: chartType === "pie" ? "outside" : "top",
                },
                areaStyle: chartType === "area" ? {} : undefined,
                animationDuration,
              },
            ],
    };
  }, [
    name,
    value,
    seriesName,
    chartType,
    colors,
    tooltipEnabled,
    title,
    barWidth,
    legendPosition,
    animationDuration,
    labelFontSize,
    valueType,
    series,
  ]);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    // Initialize the chart
    const myChart = echarts.init(chartDom);
    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to dispose of the chart instance
    return () => {
      myChart.dispose(); // Dispose of the chart
      window.removeEventListener("resize", handleResize); // Clean up the event listener
    };
  }, [option]);

  return <div className="mt-4 flex h-[60vh] w-full items-center justify-center" ref={chartRef}></div>;
};

export default GenericChart;
