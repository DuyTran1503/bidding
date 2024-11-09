import React, { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";

interface GenericChartProps {
  name?: string[]; // Mảng tên hoặc nhãn cho mỗi điểm dữ liệu trên biểu đồ.
  value?: (number | string)[]; // Mảng giá trị tương ứng với mỗi tên trong biểu đồ.
  seriesName?: string; // Tên cho chuỗi dữ liệu, hữu ích cho biểu đồ nhiều chuỗi.
  chartType: "bar" | "line" | "pie" | "area" | "radar"; // Loại biểu đồ cần hiển thị.
  colors?: string[]; // Mảng màu để tùy chỉnh màu sắc cho các điểm dữ liệu hoặc chuỗi.
  tooltipEnabled?: boolean; // Bật hoặc tắt tooltip cho các điểm dữ liệu.
  height?: number; // Chiều cao của biểu đồ, đơn vị là pixel.
  width?: string; // Chiều rộng của biểu đồ, ví dụ: "100%" hoặc cụ thể theo pixel.
  title?: string; // Tiêu đề hiển thị trên đầu biểu đồ.
  legendPosition?: "top" | "bottom" | "left" | "right"; // Vị trí và hiển thị ghi chú trên biểu đồ.
  animationDuration?: number; // Thời lượng hiệu ứng chuyển động của biểu đồ, tính theo mili giây.
  labelFontSize?: number; // Kích thước chữ cho các nhãn hiển thị trên biểu đồ.
  barWidth?: number; // Độ rộng của các cột trong biểu đồ cột (chỉ áp dụng cho biểu đồ cột).
  valueType?: "currency" | "quantity" | "date"; // Loại giá trị để hiển thị: giá, số lượng hoặc ngày.
  rotate?: number; // Góc nghiêng khi thấy tên nó bị dài.
  grid?: number; // Điều khiển khoảng cách từ name tới biểu đồ, phù hợp cho cái nào cần cho cái nào có name dài và phải để nghiêng.
}

const GenericChart: React.FC<GenericChartProps> = ({
  name,
  value,
  seriesName,
  chartType,
  colors,
  tooltipEnabled = true,
  height = 400,
  width = "100%",
  title,
  legendPosition,
  animationDuration,
  labelFontSize = 10,
  barWidth,
  grid = 80,
  valueType = "quantity", // Mặc định là số lượng
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const computedRotate = name && name.length > 5 ? 45 : 0;

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
        ? name?.map((n, i) => ({ name: n, value: value?.[i], itemStyle: { color: colors?.[i] } }))
        : value?.map((v, i) => ({ value: v, itemStyle: { color: colors?.[i] } }));

    return {
      tooltip: {
        show: tooltipEnabled,
        formatter: (params: any) => {
          const formattedValue =
            valueType === "currency"
              ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(params.value)
              : new Intl.NumberFormat("vi-VN").format(params.value); // Hiển thị giá trị đầy đủ không làm tròn
          if (chartType === "pie") {
            return `${params.name}: ${formattedValue} (${params.percent}%)`;
          }
          return `${params.name}: ${formattedValue}`;
        },
      },
      title: {
        text: title,
        left: "center",
      },
      legend: legendPosition
        ? {
            orient: legendPosition === "left" || legendPosition === "right" ? "vertical" : "horizontal",
            [legendPosition]: "0%",
            itemGap: 10,
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
      series: [
        {
          colors: colors,
          name: seriesName,
          type: chartType,
          data: seriesData,
          barWidth: barWidth,
          label: {
            show: true,
            fontSize: labelFontSize,
            // color: "#333",
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
    height,
    valueType,
  ]);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    myChart.setOption(option);

    // Cleanup function to dispose the ECharts instance
    return () => {
      myChart.dispose();
    };
  }, [option]);

  return <div className="mt-4" ref={chartRef} style={{ minHeight: height, width }}></div>;
};

export default GenericChart;
