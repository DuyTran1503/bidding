import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useArchive } from "@/hooks/useArchive";
import { IChartInitialState } from "@/services/store/chart/chart.slice";
import GenericChart from "@/components/chart/GenericChart";
import CustomTabs from "@/components/table/CustomTabs";
import Heading from "@/components/layout/Heading";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject, getProjectById } from "@/services/store/project/project.thunk";
import FormTreeSelect from "@/components/form/FormTreeSelect";
import {
    compareBarChartTotalAmount,
    compareBidderCount,
    compareBidSubmissionTime,
    compareConstructionTime,
    comparePieChartTotalAmount,
    detailProjectByIds
} from "@/services/store/CompareProject/compareProject.thunk";
import Button from "@/components/common/Button";
import { ICompareProjectInitialState } from "@/services/store/CompareProject/compareProject.slice";
import { employeeEducationLevelStatisticByEnterprise, projectByFundingsource, projectByIndustry } from "@/services/store/chart/chart.thunk";
import { Col, message, Row } from "antd";
import TableChart from "@/components/chart/TableChart";
import { ICompareProject } from "@/services/store/CompareProject/compareProject.model";
import ProjectDetail from "@/components/chart/ProjectTable";

const Statistical: React.FC = () => {
    const { state: stateChart, dispatch: dispatchChart } = useArchive<IChartInitialState>("chart");
    const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
    const { state: stateCompare, dispatch: dispatchCompare } = useArchive<ICompareProjectInitialState>("compareproject");
    const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<string>("1"); // Track active tab
    const treeSelectIdsRef = useRef<string[]>([]);

    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch initial data on component mount
    useEffect(() => {
        dispatchProject(getListProject());
        dispatchChart(projectByIndustry({}));
        dispatchChart(projectByFundingsource({}));
    }, [dispatchChart, dispatchProject]);

    // Fetch selected project details and populate treeData for project list
    useEffect(() => {
        if (id) {
            dispatchProject(getProjectById(id));
        }
    }, [id, dispatchProject]);

    // Format treeData when projects list updates
    useEffect(() => {
        const formattedData = formatTreeData(stateProject.listProjects || []);
        setTreeData(formattedData);
    }, [stateProject.listProjects]);

    // Fetch data when a specific tab becomes active
    const fetchTabData = useCallback((tabKey: string, projectId: string) => {
        switch (tabKey) {
            case "1":
                return dispatchCompare(detailProjectByIds({ body: { project_ids: [projectId] } }));
                case "2":
                    return dispatchCompare(compareBarChartTotalAmount({ body: { project_ids: [projectId] } }));
            case "3":
                return dispatchCompare(compareConstructionTime({ body: { project_ids: [projectId] } }));
            case "4":
                return dispatchCompare(compareBidSubmissionTime({ body: { project_ids: [projectId] } }));
            case "5":
                return dispatchCompare(comparePieChartTotalAmount({ body: { project_ids: [projectId] } }));
            case "6":
                return dispatchCompare(compareBidderCount({ body: { project_ids: [projectId] } }));
            // default:
            //     return Promise.resolve(); // Không làm gì nếu không phải các tab trên
        }
    }, [dispatchCompare]);

    // Handle adding projects to comparison
    // const handleAddToCompare = useCallback(() => {
    //     const projectId = stateProject.project?.id;
    //     if (!projectId) return;

    //     const targetTab = activeTab === "1" ? "2" : activeTab; // Nếu ở tab 1 thì chuyển thành tab 2
    //     fetchTabData(targetTab, projectId)
    //         .then(() => {
    //             message.success("Dữ liệu so sánh đã được cập nhật!");
    //         })
    //         .catch(() => {
    //             message.error("Có lỗi xảy ra khi gọi dữ liệu so sánh.");
    //         });
    // }, [activeTab, fetchTabData, stateProject.project]);

    const handleAddToCompare = useCallback(() => {
        const projectId = stateProject.project?.id;
        const updatedProjectIds = [projectId, ...new Set([...treeSelectIdsRef.current])];
        message.loading("Đang so sánh...");
        fetchTabData(updatedProjectIds, projectId)
            .then(() => {
                message.success("So sánh thành công!");
            })
            .catch((error) => {
                message.error("Có lỗi xảy ra trong quá trình so sánh.", error);
            });
    }, [stateProject.project, fetchTabData]);

    // Format data for FormTreeSelect
    const formatTreeData = (data: any[]): { title: string; value: string; key: string; children?: any[] }[] => {
        // if (!Array.isArray(data)) return []; // Kiểm tra nếu `data` không phải là mảng thì trả về mảng rỗng
        return data.map((item) => ({
            title: item.name,
            value: item.id.toString(),
            key: item.id.toString(),
            children: item.children ? formatTreeData(item.children) : [],
        }));
    };
    
    useEffect(() => {
        const investor = stateProject.project?.investor?.id;
        if (investor && !stateChart.employeeEducationLevelStatisticByEnterprise) {
            dispatchChart(employeeEducationLevelStatisticByEnterprise(investor));
        }
    }, [stateProject.project, stateChart.employeeEducationLevelStatisticByEnterprise, dispatchChart]);

    const childChartData = useMemo(() => {
        return stateCompare.comparePieChartTotalAmount.filter(
            (item: ICompareProject) => Array.isArray(item.children) && item.children.length > 0
        ).map((item: ICompareProject) => ({
            parentId: item.name,
            children: item.children!.map((child: ICompareProject) => ({
                id: child.id,
                name: child.name,
                value: child.value,
            }))
        }));
    }, [stateCompare.comparePieChartTotalAmount]);

    const projectId = stateProject.project?.id;

    const tabItems = useMemo(() => [
        // Tab đầu tiên luôn hiển thị
        {
            key: "1",
            label: "Thống kê dự án",
            content: (
                <>
                    <GenericChart
                        chartType="pie"
                        title="Thống kê trình độ học vấn của nhân viên"
                        name={Object.keys(stateChart.employeeEducationLevelStatisticByEnterprise || {}).map((key) => key)}
                        value={Object.values(stateChart.employeeEducationLevelStatisticByEnterprise || {}).map(Number)}
                        legendPosition="bottom"
                    />
                    <GenericChart
                        chartType="bar"
                        title="Thống kê ngành"
                        name={stateChart.industryData.map(({ name }) => name)}
                        value={stateChart.industryData.map(({ value }) => value)}
                        seriesName="Dữ liệu Ngành"
                    />
                    <ProjectDetail detailProjectByIds={stateCompare.detailProjectByIds} />
                </>
            ),
        },

        {
            key: "2",
            label: "Tổng số tiền",
            content: (
                <>
                    <GenericChart
                        chartType="bar"
                        title="Biểu đồ so sánh tổng số tiền"
                        name={stateCompare.compareBarChartTotalAmount.map(item => item.name)}
                        value={stateCompare.compareBarChartTotalAmount.map(item => item.total_amount)}
                        // seriesName="Tổng số tiền"
                        grid={120}
                        valueType="currency"
                        rotate={45}
                        colors={stateCompare.compareBarChartTotalAmount.map(item =>
                            item.id === projectId ? "red" : "#5470C6"
                        )}
                    />
                    <TableChart
                        compareData={stateCompare.compareBarChartTotalAmount.map(item => ({
                            id: String(item.id || ""),
                            name: item.name,
                            value: item.total_amount
                        }))}
                        projectId={projectId}
                        valueType="currency"
                    />

                </>
            ),
        },
        {
            key: "3",
            label: "Thời gian thực hiện dự án",
            content: (
                <>
                    <GenericChart
                        chartType="bar"
                        title="Biểu đồ so sánh thời gian thực hiện dự án"
                        name={stateCompare.compareConstructionTime.map(item => item.name)}
                        value={stateCompare.compareConstructionTime.map(item => item.duration)}
                        // seriesName="Tổng số tiền"
                        grid={120}
                        valueType="date"
                        colors={stateCompare.compareConstructionTime.map(item =>
                            item.id === projectId ? "red" : "#5470C6"
                        )}
                    />
                    <TableChart
                        compareData={stateCompare.compareConstructionTime.map(item => ({
                            id: String(item.id || ""),
                            name: item.name,
                            value: item.duration
                        }))}
                        projectId={projectId}
                        valueType="date"
                    />
                </>
            ),
        },
        {
            key: "4",
            label: "Thời gian mở thầu",
            content: (
                <>
                    <GenericChart
                        chartType="bar"
                        title="Biểu đồ so sánh thời gian mở thầu"
                        name={stateCompare.compareBidSubmissionTime.map(item => item.name)}
                        value={stateCompare.compareBidSubmissionTime.map(item => item.duration)}
                        seriesName="Ngày"
                        grid={120}
                        valueType="date"
                        colors={stateCompare.compareBidSubmissionTime.map(item =>
                            item.id === projectId ? "red" : "#5470C6"
                        )}
                    />
                    <TableChart
                        compareData={stateCompare.compareBidSubmissionTime.map(item => ({
                            id: String(item.id || ""),
                            name: item.name,
                            value: item.duration
                        }))}
                        projectId={projectId}
                        valueType="date"
                    />
                </>
            ),
        },
        {
            key: "5",
            label: "Tỷ lệ vốn các project con của các dự án ",
            content: (
                <>
                    <GenericChart
                        chartType="pie"
                        title="Biểu đồ so sánh tỷ lệ vốn các project con của các dự án "
                        name={stateCompare.comparePieChartTotalAmount.map((item, index) => `${item.name} (${index + 1})`)}
                        value={stateCompare.comparePieChartTotalAmount.map(item => item.value)}
                        valueType="currency"
                        legendPosition="bottom"
                    />
                    <Row gutter={[24, 24]} className="mb-8">
                        {childChartData.length > 0 && childChartData.map((childData, index) => (
                            <Col xs={24} sm={24} md={12} xl={12}
                                key={`child-chart-${index}`}>
                                <GenericChart
                                    chartType="pie"
                                    title={`${++index} - Biểu đồ chi tiết cho dự án (${childData.parentId})`}
                                    name={childData.children.map(child => child.name)}
                                    value={childData.children.map(child => child.value)}
                                    valueType="currency"
                                    legendPosition="bottom"
                                    rotate={100}
                                    titleFontSize={14}
                                />
                            </Col>
                        ))}
                    </Row>
                    <TableChart
                        compareData={stateCompare.comparePieChartTotalAmount.map(item => ({
                            id: String(item.id || ""),
                            name: item.name,
                            value: item.value
                        }))}
                        projectId={projectId}
                        valueType="currency"
                        chartType="pie"
                    />
                </>
            ),
        },
        {
            key: "6",
            label: "Số lượng nhà thầu tham gia",
            content: (
                <>
                    <GenericChart
                        chartType="bar"
                        title="Biểu đồ so sánh số lượng nhà thầu tham gia"
                        name={stateCompare.compareBidderCount.map(item => item.name)}
                        value={stateCompare.compareBidderCount.map(item => item.bidder_count)}
                        seriesName="Số lượng nhà thầu"
                        grid={120}
                        valueType="quantity"
                        colors={stateCompare.compareBidderCount.map(item =>
                            item.id === projectId ? "red" : "#5470C6"
                        )}
                    />
                    <TableChart
                        compareData={stateCompare.compareBidderCount.map(item => ({
                            id: String(item.id || ""),
                            name: item.name,
                            value: item.bidder_count
                        }))}
                        projectId={projectId}
                        valueType="quantity"
                    />
                </>
            ),
        },
    ], [stateCompare, stateChart]);

    return (
        <>
            <Heading
                title={`Thống kê chi tiết ${stateProject.project?.name || ""}`}
                hasBreadcrumb
                buttons={[
                    {
                        type: "secondary",
                        text: "Hủy",
                        icon: <IoClose className="text-[18px]" />,
                        onClick: () => {
                            navigate(-1);
                        },
                    },
                ]}
            />
            <div className="flex items-center space-x-4">
                <FormTreeSelect
                    placeholder="So sánh với dự án..."
                    treeData={treeData}
                    width="400px"
                    multiple
                    value={selectedIds}
                    onChange={(value) => {
                        const updatedValues = Array.isArray(value) ? value : [value];
                        setSelectedIds(updatedValues);
                        treeSelectIdsRef.current = updatedValues;
                    }}
                />
                <Button
                    type="primary"
                    text="Thêm vào so sánh"
                    onClick={handleAddToCompare}
                    className="w-40"
                />
            </div>

            <CustomTabs
                items={tabItems}
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)} // Set active tab to trigger data fetch
            />
        </>
    );
};

export default Statistical;
