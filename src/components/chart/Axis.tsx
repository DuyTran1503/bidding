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
    "insideBottomRight"
] as const;

interface AbleBarChartProps {
    data: {
        name: string;
        values: number[];
    }[];
    xAxisData: string[];
    title: string;
}

type AlignOptions = "left" | "center" | "right";
type VerticalAlignOptions = "top" | "middle" | "bottom";
type PositionOptions = typeof posList[number];
type BarLabelOption = NonNullable<echarts.BarSeriesOption["label"]>;
const AbleBarChart: React.FC<AbleBarChartProps> = ({
    data,
    title,
    xAxisData
}) => {
    const chartRef = useRef<HTMLDivElement>(null);

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
        const myChart = echarts.init(chartRef.current!);

        const labelOption: BarLabelOption = {
            show: true,
            position: config.position,
            distance: config.distance,
            align: config.align,
            verticalAlign: config.verticalAlign,
            rotate: config.rotate,
            fontSize: 16,
            formatter: "{c}  {name|{a}}",
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
                },
            },
            legend: {
                data: data.map((item) => item.name),
                top: "bottom",
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
                    max: 100
                },
            ],
            series: data.map((seriesData) => ({
                name: seriesData.name,
                type: "bar",
                data: seriesData.values,
                label: labelOption,
                emphasis: {
                    focus: "series",
                },
                barGap: 0,
            }))
        }

        myChart.setOption(option);

        const handleResize = () => {
            myChart.resize();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            myChart.dispose();
        };
    }, [data, xAxisData, title, config]);

    return (
        <div className="required relative">
            <button
                onClick={() => setShowControls(!showControls)}
                className="px-4 py-2 bg-black-500 text-white rounded shadow-md"
            >
                {showControls ? "Close Controls" : "Open Controls"}
            </button>
            <div className="w-full h-[60vh]" ref={chartRef}></div>

            {showControls && (
                <div
                    className={` p-4 rounded-lg 
            shadow-md w-[300px] bg-black-500 text-white space-y-4 absolute top-12 left-0 
            transition-all duration-300 ease-in-out transform ${showControls ?
                            "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                        }`}
                >
                    <h4 className="font-semibold text-center">Chart Controls</h4>
                    <label className="flex items-center justify-between">
                        Rotate:
                        <input
                            type="range"
                            min="-90"
                            max="90"
                            value={config.rotate}
                            onChange={(e) =>
                                setConfig({ ...config, rotate: parseInt(e.target.value) })
                            }
                            className="w-36"
                        />
                    </label>
                    <label className="flex items-center justify-between">
                        Align:
                        <select
                            value={config.align}
                            onChange={(e) =>
                                setConfig({ ...config, align: e.target.value as AlignOptions })
                            }
                            className="w-36 bg-white text-black-500 rounded"
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
                            className="w-36 bg-white text-black-500 rounded"
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
                            className="w-36 bg-white text-black-500 rounded"
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
                            onChange={(e) =>
                                setConfig({ ...config, distance: parseInt(e.target.value) })
                            }
                            className="w-36"
                        />
                    </label>
                </div>
            )}
        </div>
    );
};

export default AbleBarChart;
