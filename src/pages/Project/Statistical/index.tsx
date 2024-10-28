import React, { useEffect } from "react";
import { useArchive } from "@/hooks/useArchive";
import { IChartInitialState } from "@/services/store/chart/chart.slice";
import {
    // averageProjectPurationByIndustry,
    // projectByDomestic,
    projectByFundingsource,
    projectByIndustry,
    // projectByOrganizationType,
    // projectBySelectionMethod,
    // projectBySubmissionMethod,
    // projectByTendererInvestor
} from "@/services/store/chart/chart.thunk";
import AreaChart from "@/components/chart/AreaChart";
import LineChart from "@/components/chart/LineChart";
import RadarChart from "@/components/chart/RadarChart";
import Histogram from "@/components/chart/HistogramChart";
import ScatterPlot from "@/components/chart/ScatterPlot";
import GenericChart from "@/components/chart/GenericChart";
import CustomTabs from "@/components/table/CustomTabs";
import Heading from "@/components/layout/Heading";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getProjectById } from "@/services/store/project/project.thunk";
import FormTreeSelect from "@/components/form/FormTreeSelect";

const Statistical: React.FC = () => {
    const { state: stateChart, dispatch: dispatchChart } = useArchive<IChartInitialState>("chart");
    const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        dispatchChart(projectByIndustry({}));
        dispatchChart(projectByFundingsource({}));
        // dispatchChart(averageProjectPurationByIndustry({}));
        // dispatchChart(projectByDomestic({}));
        // dispatchChart(projectByOrganizationType({}));
        // dispatchChart(projectBySelectionMethod({}));
        // dispatchChart(projectBySubmissionMethod({}));
        // dispatchChart(projectByTendererInvestor({}));
    }, [dispatchChart]);

    useEffect(() => {
        if (id) {
            dispatchProject(getProjectById(id));
        }
    }, [id, dispatchProject]);

    const tabItems = [
        {
            key: "1",
            label: "Thống kê chung",
            content: (
                <>
                    <FormTreeSelect
                        placeholder="So sánh với dự án..."
                        // label="Chọn danh mục"
                        treeData={[]}
                        // onChange={handleSelectChange}
                        width="200px" // Điều chỉnh chiều rộng
                        multiple={true}
                    />
                    <GenericChart
                        chartType="bar"
                        title="Thống kê chung"
                        name={stateChart.industryData.map(({ name }) => name)}
                        value={stateChart.industryData.map(({ value }) => value)}
                        seriesName="Dữ liệu Biểu đồ"
                    />
                </>
            ),
        },
        {
            key: "2",
            label: "Dự án theo nguồn tài trợ",
            content: (
                <GenericChart
                    chartType="pie"
                    title="Dự án theo nguồn tài trợ"
                    name={stateChart.fundingData.map(({ name }) => name)}
                    value={stateChart.fundingData.map(({ value }) => value)}
                    seriesName="Dữ liệu Biểu đồ"
                />
            ),
        },
        {
            key: "3",
            label: "Area Chart",
            content: <AreaChart />,
        },
        {
            key: "4",
            label: "Radar Chart",
            content: <RadarChart />,
        },
        // {
        //     key: "5",
        //     label: "Pie Chart",
        //     content: <PieChart />,
        // },
        {
            key: "6",
            label: "Line Chart",
            content: <LineChart />,
        },
        {
            key: "7",
            label: "Histogram",
            content: <Histogram />,
        },
        {
            key: "8",
            label: "Scatter Plot",
            content: <ScatterPlot />,
        },
    ];

    return (
        <>
            <Heading
                title={"Thống kê chi tiết " + (stateProject.project?.name || "")}
                hasBreadcrumb
                buttons={[
                    {
                        type: "secondary",
                        text: "Hủy",
                        icon: <IoClose className="text-[18px]" />,
                        onClick: () => {
                            navigate("/project");
                        },
                    },
                ]}
            />
            <CustomTabs items={tabItems} />
        </>
    );
};

export default Statistical;
