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
    barWidth
}) => {
    const chartRef = useRef<HTMLDivElement>(null);

    const option = useMemo(() => {
        const seriesData = chartType === "pie"
            ? name?.map((n, i) => ({ name: n, value: value?.[i] }))
            : value?.map((v) => ({ value: v }));

        return {
            tooltip: {
                show: tooltipEnabled,
                formatter: chartType === "pie" ? '{b}: {c} ({d}%)' : undefined,
            },
            title: {
                text: title,
                left: 'center',
                textStyle: { fontSize: Math.max(16, height / 20) }, // Responsive title font size
            },
            legend: legendPosition ? { // Chỉ hiện legend nếu legendPosition có giá trị
                orient: legendPosition === "left" || legendPosition === "right" ? "vertical" : "horizontal",
                [legendPosition]: '5%',
                itemGap: 10,
            } : undefined,
            xAxis: chartType !== "pie" ? { type: "category", data: name } : undefined,
            yAxis: chartType !== "pie" ? { type: "value" } : undefined,
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
                        formatter: chartType === "pie" ? '{b}: {d}%' : '{c}',
                        position: chartType === "pie" ? 'outside' : 'top',
                    },
                    areaStyle: chartType === "area" ? {} : undefined,
                    animationDuration,
                },
            ],
        };
    }, [name, value, seriesName, chartType, colors, tooltipEnabled, title, barWidth, legendPosition, animationDuration, labelFontSize, height]);

    useEffect(() => {
        const chartDom = chartRef.current;
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        myChart.setOption(option);

        const resizeChart = () => {
            myChart.resize();
        };
        window.addEventListener("resize", resizeChart);

        return () => {
            window.removeEventListener("resize", resizeChart);
            myChart.dispose();
        };
    }, [option]);

    return (
        <div className="mt-4" ref={chartRef} style={{ minHeight: height, width }}></div>
    );
};

export default GenericChart;
