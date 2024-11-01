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
import { message } from "antd";

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
    const handleAddToCompare = useCallback(() => {
        const investorId = stateProject.project?.investor?.id;
        const updatedProjectIds = [...new Set([...treeSelectIdsRef.current])];

        if (investorId) {
            updatedProjectIds.push(investorId);
        }

        if (updatedProjectIds.length > 0) {
            Promise.all([
                dispatchCompare(compareBarChartTotalAmount({ body: { project_ids: updatedProjectIds } })),
                dispatchCompare(compareBidderCount({ body: { project_ids: updatedProjectIds } })),
                dispatchCompare(compareBidSubmissionTime({ body: { project_ids: updatedProjectIds } })),
                dispatchCompare(compareConstructionTime({ body: { project_ids: updatedProjectIds } })),
                dispatchCompare(comparePieChartTotalAmount({ body: { project_ids: updatedProjectIds } })),
            ])
                .then(() => {
                    setShowComparisonTabs(true); // Hiển thị các tab so sánh
                    message.success("So sánh thành công!"); // Hiển thị thông báo thành công
                })
                .catch((error) => {
                    message.error("Có lỗi xảy ra trong quá trình so sánh.", error);
                });
        }
    }, [stateProject.project, dispatchCompare]);

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

    // Tạo `tabItems` chỉ khi `stateCompare`, `stateChart.industryData`, hoặc `educationData` thay đổi
    const tabItems = useMemo(() => [
        {
            key: "1",
            label: "Thống kê dự án",
            content: (
                <>
                    <GenericChart
                        chartType="bar"
                        title="Thống kê ngành"
                        name={stateChart.industryData.map(({ name }) => name)}
                        value={stateChart.industryData.map(({ value }) => value)}
                        seriesName="Dữ liệu Ngành"
                    />
                    <GenericChart
                        chartType="pie"
                        title="Thống kê trình độ học vấn của nhân viên"
                        name={Object.keys(educationData).map((key) => nameMapping[key] || key)}
                        value={Object.values(educationData).map(Number)}
                        seriesName="Trình độ học vấn"
                    />
                </>
            ),
        }, ...(showComparisonTabs ? [
            {
                key: "2",
                label: "Bảng so sánh tổng số tiền",
                content: (
                    <GenericChart
                        chartType="bar"
                        title="Bảng so sánh tổng số tiền"
                        name={stateCompare.compareBarChartTotalAmount.map(item => item.name)}
                        value={stateCompare.compareBarChartTotalAmount.map(item => item.total_amount)}
                        seriesName="Tổng số tiền"
                        height={600}
                        grid={150}
                        barWidth={50}
                        isCurrency={true}
                    />
                ),
            },
            {
                key: "3",
                label: "Bảng so sánh tổng số tiền",
                content: (
                    <GenericChart
                        chartType="bar"
                        title="Bảng so sánh tổng số tiền"
                        name={stateCompare.compareConstructionTime.map(item => item.name)}
                        value={stateCompare.compareConstructionTime.map(item => item.duration)}
                        seriesName="Tổng số tiền"
                        height={600}
                        grid={150}
                        barWidth={50}
                        isCurrency={true}
                    />
                ),
            },
            {
                key: "4",
                label: "Bảng so sánh tổng số tiền",
                content: (
                    <GenericChart
                        chartType="bar"
                        title="Bảng so sánh tổng số tiền"
                        name={stateCompare.compareBidSubmissionTime.map(item => item.name)}
                        value={stateCompare.compareBidSubmissionTime.map(item => item.duration)}
                        seriesName="Tổng số tiền"
                        height={600}
                        grid={150}
                        barWidth={50}
                        isCurrency={true}
                    />
                ),
            },
            {
                key: "5",
                label: "Bảng so sánh tổng số tiền",
                content: (
                    <GenericChart
                        chartType="bar"
                        title="Bảng so sánh tổng số tiền"
                        name={stateCompare.comparePieChartTotalAmount.map(item => item.name)}
                        value={stateCompare.comparePieChartTotalAmount.map(item => item.value)}
                        seriesName="Tổng số tiền"
                        height={600}
                        grid={150}
                        barWidth={50}
                        isCurrency={true}
                    />
                ),
            },
            {
                key: "6",
                label: "Bảng so sánh tổng số tiền",
                content: (
                    <GenericChart
                        chartType="bar"
                        title="Bảng so sánh tổng số tiền"
                        name={stateCompare.compareBidderCount.map(item => item.name)}
                        value={stateCompare.compareBidderCount.map(item => item.bidder_count)}
                        seriesName="Tổng số tiền"
                        height={600}
                        grid={150}
                        barWidth={50}
                        isCurrency={true}
                    />
                ),
            }] : []),
    ], [stateCompare, stateChart, educationData]);

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
            <FormTreeSelect
                placeholder="So sánh với dự án..."
                treeData={treeData} // Đã chuyển đổi `treeData`
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
            <CustomTabs items={tabItems} />
        </>
    );
};

export default Statistical;
