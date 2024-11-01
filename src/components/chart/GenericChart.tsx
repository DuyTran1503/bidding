import React, { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";

interface GenericChartProps {
    name?: string[];
    value?: number[];
    seriesName?: string;
    chartType: "bar" | "line" | "pie" | "area" | "radar";
    colors?: string[];
    tooltipEnabled?: boolean;
    height?: number;
    width?: string;
    title?: string;
    legendPosition?: "top" | "bottom" | "left" | "right";
    animationDuration?: number;
    labelFontSize?: number;
    barWidth?: number;
    isCurrency?: boolean; // Thêm prop để xác định biểu đồ giá
    rotate?: number;
    grid?: number; // Thêm prop
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
    animationDuration = 800,
    labelFontSize = 12,
    barWidth,
    rotate,
    grid = 80,
    isCurrency = false, // Mặc định là không phải biểu đồ giá
}) => {
    const chartRef = useRef<HTMLDivElement>(null);

    // Hàm định dạng số với dấu phẩy và đơn vị, làm tròn theo đơn vị khi hiển thị trên biểu đồ
    const formatNumber = (num: number) => {
        if (num >= 1e9) return new Intl.NumberFormat('vi-VN').format(num / 1e9) + " tỷ";
        if (num >= 1e6) return new Intl.NumberFormat('vi-VN').format(num / 1e6) + " triệu";
        // if (num >= 1e3) return new Intl.NumberFormat('vi-VN').format(num / 1e3) + " nghìn";
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    // Hàm định dạng số đầy đủ, không làm tròn
    const formatFullNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const option = useMemo(() => {
        const seriesData = chartType === "pie"
            ? name?.map((n, i) => ({ name: n, value: value?.[i] }))
            : value?.map((v) => ({ value: v }));

        return {
            tooltip: {
                show: tooltipEnabled,
                formatter: (params: any) => {
                    const fullValue = formatFullNumber(params.value);
                    if (chartType === "pie") {
                        return `${params.name}: ${fullValue} (${params.percent}%)`;
                    }
                    return `${params.name}: ${fullValue}${isCurrency ? " VND" : ""}`;
                },
            },
            title: {
                text: title,
                left: 'center',
            },
            legend: legendPosition ? {
                orient: legendPosition === "left" || legendPosition === "right" ? "vertical" : "horizontal",
                [legendPosition]: '5%',
                itemGap: 10,
            } : undefined,
            xAxis: chartType !== "pie" ? {
                type: "category",
                data: name,
                axisLabel: {
                    interval: 0,
                    rotate: rotate,
                    verticalAlign: 'top',
                    overflow: 'truncate',
                    formatter: (value: string) => value.length > 20 ? value.substring(0, 20) + "..." : value,
                }
            } : undefined,
            yAxis: chartType !== "pie" ? {
                type: "value",
                axisLabel: {
                    formatter: (value: number) => formatNumber(value) + (isCurrency ? " VND" : ""),
                }
            } : undefined,
            grid: {
                bottom: grid,
            },
            series: [
                {
                    name: seriesName,
                    type: chartType,
                    data: seriesData,
                    barWidth: barWidth,
                    label: {
                        show: true,
                        fontSize: labelFontSize,
                        color: "#333",
                        formatter: (params: any) => {
                            if (chartType === "pie") {
                                return `${params.name}: ${params.percent}%`;
                            }
                            return formatNumber(params.value) + (isCurrency ? " VND" : "");
                        },
                        position: chartType === "pie" ? 'outside' : 'top',
                    },
                    areaStyle: chartType === "area" ? {} : undefined,
                    animationDuration,
                },
            ],
        };
    }, [name, value, seriesName, chartType, colors, tooltipEnabled, title, barWidth, legendPosition, animationDuration, labelFontSize, height, isCurrency]);

    useEffect(() => {
        const chartDom = chartRef.current;
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        myChart.setOption(option);

        // const resizeChart = () => {
        //     myChart.resize();
        // };
        // window.addEventListener("resize", resizeChart);

        // return () => {
        //     window.removeEventListener("resize", resizeChart);
        //     myChart.dispose();
        // };
    }, [option]);

    return (
        <div className="mt-4" ref={chartRef} style={{ minHeight: height, width }}></div>
    );
};

export default GenericChart;
