import React from "react";
import GenericChart from "@/components/chart/GenericChart";
import { Col } from "antd";

interface ChartSectionProps {
    title: string;
    chartTitle: string;
    data: { name: string; value: number }[];
    chartType: "bar" | "pie" | "line" | "area" | "radar";
    seriesName?: string;
    barWidth?: number;
    valueType?: "currency" | "quantity" | "date";
    description: string[];
    colors?: string[];
    tooltipEnabled?: boolean;
    height?: string;
    width?: string;
    legendPosition?: "top" | "bottom" | "left" | "right";
    animationDuration?: number;
    labelFontSize?: number;
    rotate?: number;
    grid?: number;
    titleFontSize?: number;
}

const ChartSection: React.FC<ChartSectionProps> = ({
    title,
    chartTitle,
    data,
    chartType,
    // seriesName = "Dữ liệu Biểu đồ",
    barWidth,
    valueType = "quantity",
    description,
    colors,
    tooltipEnabled = true,
    legendPosition = "bottom",
    animationDuration = 1000,
    labelFontSize = 12,
    rotate = 0,
    grid = 80,
    titleFontSize = 16,
}) => {
    return (
        <Col xs={24} sm={24} md={24} xl={12}>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {/* <div className="w-full max-w-full overflow-hidden"> */}
                <GenericChart
                    chartType={chartType}
                    title={chartTitle}
                    name={data.map(({ name }) => name)}
                    value={data.map(({ value }) => value)}
                    // seriesName={seriesName}
                    barWidth={barWidth}
                    valueType={valueType}
                    colors={colors}
                    tooltipEnabled={tooltipEnabled}
                    legendPosition={legendPosition}
                    animationDuration={animationDuration}
                    labelFontSize={labelFontSize}
                    rotate={rotate}
                    grid={grid}
                    titleFontSize={titleFontSize}
                />
            {/* </div> */}
            <ul className="list-disc list-inside mt-4">
                {description.map((desc, index) => (
                    <li key={index}>{desc}</li>
                ))}
            </ul>
        </Col>
    );
};

export default ChartSection;