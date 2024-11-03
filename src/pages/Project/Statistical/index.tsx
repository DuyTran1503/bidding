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
    comparePieChartTotalAmount
} from "@/services/store/CompareProject/compareProject.thunk";
import Button from "@/components/common/Button";
import { ICompareProjectInitialState } from "@/services/store/CompareProject/compareProject.slice";
import { employeeEducationLevelStatisticByEnterprise, projectByFundingsource, projectByIndustry } from "@/services/store/chart/chart.thunk";
import { Col, message, Row } from "antd";
import TableChart from "@/components/chart/TableChart";
import { ICompareProject } from "@/services/store/CompareProject/compareProject.model";

const Statistical: React.FC = () => {
    const { state: stateChart, dispatch: dispatchChart } = useArchive<IChartInitialState>("chart");
    const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
    const { state: stateCompare, dispatch: dispatchCompare } = useArchive<ICompareProjectInitialState>("compareproject");
    const [showComparisonTabs, setShowComparisonTabs] = useState(false); // Trạng thái để hiển thị các tab so sánh
    const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
    const treeSelectIdsRef = useRef<string[]>([]);

    const navigate = useNavigate();
    const { id } = useParams();

    // Gọi API và lấy danh sách dự án khi component mount
    useEffect(() => {
        dispatchChart(projectByIndustry({}));
        dispatchChart(projectByFundingsource({}));
        dispatchProject(getListProject());
    }, [dispatchChart, dispatchProject]);

    // Lấy dữ liệu dự án theo ID
    useEffect(() => {
        if (id) {
            dispatchProject(getProjectById(id));
        }
    }, [id, dispatchProject]);

    // Cập nhật treeData từ projects khi stateProject.projects thay đổi
    useEffect(() => {
        const formattedData = formatTreeData(stateProject.listProjects || []);
        setTreeData(formattedData);
    }, [stateProject.listProjects]);

    // Lấy dữ liệu thống kê trình độ học vấn của nhân viên
    useEffect(() => {
        const investorId = stateProject.project?.investor?.id;
        if (investorId) {
            dispatchChart(employeeEducationLevelStatisticByEnterprise(investorId));
        }
    }, [stateProject.project, dispatchChart]);

    // Hàm xử lý thêm vào so sánh và gọi API so sánh
    const fetchComparisonData = useCallback((projectIds: string[]) => {
        return Promise.all([
            dispatchCompare(compareBarChartTotalAmount({ body: { project_ids: projectIds } })),
            dispatchCompare(compareBidderCount({ body: { project_ids: projectIds } })),
            dispatchCompare(compareBidSubmissionTime({ body: { project_ids: projectIds } })),
            dispatchCompare(compareConstructionTime({ body: { project_ids: projectIds } })),
            dispatchCompare(comparePieChartTotalAmount({ body: { project_ids: projectIds } })),
        ]);
    }, [dispatchCompare]);

    // Gọi API mặc định khi trang tải lần đầu
    useEffect(() => {
        const defaultProjectId = stateProject.project?.investor?.id;

        // Kiểm tra nếu dữ liệu đã tồn tại trong stateCompare, chỉ gọi API nếu dữ liệu chưa có
        if (defaultProjectId && (!stateCompare.compareBarChartTotalAmount || stateCompare.compareBarChartTotalAmount.length === 0)) {
            fetchComparisonData([defaultProjectId]);
        }
    }, [fetchComparisonData, stateProject.project, stateCompare.compareBarChartTotalAmount]);

    const handleAddToCompare = useCallback(() => {
        const investorId = stateProject.project?.investor?.id;
        const updatedProjectIds = [investorId, ...new Set([...treeSelectIdsRef.current])];

        fetchComparisonData(updatedProjectIds)
            .then(() => {
                setShowComparisonTabs(true); // Hiển thị các tab so sánh
                message.success("So sánh thành công!"); // Hiển thị thông báo thành công
            })
            .catch((error) => {
                message.error("Có lỗi xảy ra trong quá trình so sánh.", error);
            });
    }, [stateProject.project, fetchComparisonData]);

    // Hàm định dạng dữ liệu tree cho Select
    const formatTreeData = (data: any[]): { title: string; value: string; key: string; children?: any[] }[] => {
        return data.map((item) => ({
            title: item.name,
            value: item.id.toString(),
            key: item.id.toString(),
            children: item.children ? formatTreeData(item.children) : [],
        }));
    };

    // Chuyển đổi dữ liệu trình độ học vấn của nhân viên
    const educationData = useMemo(() => stateChart.employeeEducationLevelStatisticByEnterprise || {}, [stateChart]);
    const nameMapping: Record<string, string> = {
        after_university: "Sau đại học",
        university: "Đại học",
        college: "Cao đẳng",
        high_school: "Trung học phổ thông",
        secondary_school: "Trung học cơ sở",
        primary_school: "Tiểu học",
    };
    const investorId = stateProject.project?.investor?.id;
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

    // Tạo `tabItems` chỉ khi `stateCompare`, `stateChart.industryData`, hoặc `educationData` thay đổi
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
                        name={Object.keys(educationData).map((key) => nameMapping[key] || key)}
                        value={Object.values(educationData).map(Number)}
                        seriesName="Trình độ học vấn"
                        legendPosition="bottom"
                    />
                    <GenericChart
                        chartType="bar"
                        title="Thống kê ngành"
                        name={stateChart.industryData.map(({ name }) => name)}
                        value={stateChart.industryData.map(({ value }) => value)}
                        seriesName="Dữ liệu Ngành"
                    />
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
                        height={600}
                        grid={120}
                        barWidth={50}
                        valueType="currency"
                        rotate={45}
                        colors={stateCompare.compareBarChartTotalAmount.map(item =>
                            item.id === investorId ? "red" : "#5470C6"
                        )}
                    />
                    <TableChart
                        compareData={stateCompare.compareBarChartTotalAmount.map(item => ({
                            id: String(item.id || ""),
                            name: item.name,
                            value: item.total_amount
                        }))}
                        investorId={investorId}
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
                        height={600}
                        grid={150}
                        barWidth={50}
                        valueType="date"
                        colors={stateCompare.compareConstructionTime.map(item =>
                            item.id === investorId ? "red" : "#5470C6"
                        )}
                    />
                    <TableChart
                        compareData={stateCompare.compareConstructionTime.map(item => ({
                            id: String(item.id || ""),
                            name: item.name,
                            value: item.duration
                        }))}
                        investorId={stateProject.project?.investor?.id}
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
                        height={600}
                        grid={150}
                        barWidth={50}
                        valueType="date"
                        colors={stateCompare.compareBidSubmissionTime.map(item =>
                            item.id === investorId ? "red" : "#5470C6"
                        )}
                    />
                    <TableChart
                        compareData={stateCompare.compareBidSubmissionTime.map(item => ({
                            id: String(item.id || ""),
                            name: item.name,
                            value: item.duration
                        }))}
                        investorId={stateProject.project?.investor?.id}
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
                        name={stateCompare.comparePieChartTotalAmount.map(item => item.name)}
                        value={stateCompare.comparePieChartTotalAmount.map(item => item.value)}
                        height={600}
                        grid={150}
                        barWidth={50}
                        valueType="currency"
                        legendPosition="bottom"
                    // colors={stateCompare.comparePieChartTotalAmount.map(item =>
                    //     item.id === investorId ? "red" : "#5470C6"
                    // )}
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
                        investorId={stateProject.project?.investor?.id}
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
                        height={600}
                        grid={150}
                        barWidth={50}
                        valueType="quantity"
                        colors={stateCompare.compareBidderCount.map(item =>
                            item.id === investorId ? "red" : "#5470C6"
                        )}
                    />
                    <TableChart
                        compareData={stateCompare.compareBidderCount.map(item => ({
                            id: String(item.id || ""),
                            name: item.name,
                            value: item.bidder_count
                        }))}
                        investorId={stateProject.project?.investor?.id}
                        valueType="quantity"
                    />
                </>
            ),
        },
    ], [showComparisonTabs, stateCompare, stateChart, educationData]);

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
                            navigate("/project");
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
                    onChange={(value) => { treeSelectIdsRef.current = Array.isArray(value) ? value : [value]; }}
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
            />
        </>
    );
};

export default Statistical;
