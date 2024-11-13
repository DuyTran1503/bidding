import React from "react";
import GenericChart from "@/components/chart/GenericChart";
import { Col, Button, Select } from "antd";

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
    className?: string;
    // New props for select and button functionality
    selectOptions?: { label: string; value: number }[];
    selectedValue?: string;
    onSelectChange?: (value: string) => void;
    buttonText?: string;
    onButtonClick?: () => void;
    loading?: boolean;
}

const ChartSection: React.FC<ChartSectionProps> = ({
    title,
    chartTitle,
    data,
    chartType,
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
    className,
    selectOptions,
    selectedValue,
    onSelectChange,
    buttonText,
    onButtonClick,
    loading
}) => {
    return (
        <Col xs={24} sm={24} md={24} xl={12}>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className={`flex flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)] ${className}`}>

                <div className="flex gap-4 items-center">
                    {selectOptions && onSelectChange && (
                        <Select
                            placeholder="Chọn nguồn tài trợ..."
                            value={selectedValue}
                            options={selectOptions}
                            onChange={onSelectChange}
                            style={{ width: "60%", marginBottom: "1rem" }}
                        />
                    )}

                    {buttonText && onButtonClick && (
                        <Button type="primary" onClick={onButtonClick} style={{ marginBottom: "1rem" }}>
                            {buttonText}
                        </Button>
                    )}
                </div>

                <GenericChart
                    chartType={chartType}
                    title={chartTitle}
                    name={data.map(({ name }) => name)}
                    value={data.map(({ value }) => value)}
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
                    loading={loading}
                />
            </div>
            <ul className="list-disc list-inside mt-4">
                {description.map((desc, index) => (
                    <li key={index}>{desc}</li>
                ))}
            </ul>
        </Col>
    );
};

export default ChartSection;
