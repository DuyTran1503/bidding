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
import { unwrapResult } from "@reduxjs/toolkit";
import { compareBarChartTotalAmount } from "@/services/store/CompareProject/compareProject.thunk";
import Button from "@/components/common/Button";
import { ICompareProjectInitialState } from "@/services/store/CompareProject/compareProject.slice";
import { employeeEducationLevelStatisticByEnterprise, projectByFundingsource, projectByIndustry } from "@/services/store/chart/chart.thunk";

const Statistical: React.FC = () => {
    const { state: stateChart, dispatch: dispatchChart } = useArchive<IChartInitialState>("chart");
    const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
    const { dispatch: dispatchCompare } = useArchive<ICompareProjectInitialState>("compareproject");
    const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
    const [compareData, setCompareData] = useState<any[]>([]);
    const treeSelectIdsRef = useRef<string[]>([]); // Sử dụng useRef để tránh render lại khi chọn dự án

    const navigate = useNavigate();
    const { id } = useParams();

    // Lấy dữ liệu ban đầu cho biểu đồ và danh sách dự án
    useEffect(() => {
        dispatchChart(projectByIndustry({}));
        dispatchChart(projectByFundingsource({}));
        dispatchProject(getListProject())
            .then(unwrapResult)
            .then((result) => {
                const formattedData = formatTreeData(result.data);
                setTreeData(formattedData);
            });
    }, [dispatchChart, dispatchProject]);

    // Lấy dữ liệu dự án theo ID
    useEffect(() => {
        if (id) {
            dispatchProject(getProjectById(id));
        }
    }, [id, dispatchProject]);

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
            // Gọi API so sánh
            dispatchCompare(compareBarChartTotalAmount({ body: { project_ids: updatedProjectIds } }))
                .then(unwrapResult)
                .then((data) => {
                    setCompareData(data as any[]);
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

    // Tạo `tabItems` chỉ khi `compareData`, `stateChart.industryData`, hoặc `educationData` thay đổi
    const tabItems = useMemo(() => [
        {
            key: "1",
            label: "Thống kê dự án",
            content: (
                <GenericChart
                    chartType="bar"
                    title="Thống kê ngành"
                    name={stateChart.industryData.map(({ name }) => name)}
                    value={stateChart.industryData.map(({ value }) => value)}
                    seriesName="Dữ liệu Ngành"
                />
            ),
        },
        {
            key: "2",
            label: "Bảng so sánh tổng số tiền",
            content: (
                <GenericChart
                    chartType="bar"
                    title="Bảng so sánh tổng số tiền"
                    name={compareData.map(item => item.name)}
                    value={compareData.map(item => item.total_amount)}
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
            label: "Thống kê trình độ học vấn",
            content: (
                <GenericChart
                    chartType="pie"
                    title="Thống kê trình độ học vấn của nhân viên"
                    name={Object.keys(educationData).map((key) => nameMapping[key] || key)}
                    value={Object.values(educationData).map(Number)}
                    seriesName="Trình độ học vấn"
                />
            ),
        },
    ], [compareData]);

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
                treeData={treeData}
                width="400px"
                multiple
                onChange={(value) => { treeSelectIdsRef.current = Array.isArray(value) ? value : [value]; }}
            />
            <Button
                type="primary"
                text="Thêm vào so sánh"
                onClick={handleAddToCompare}
            // isDisabled={treeSelectIdsRef.current.length === 0}
            />
            <CustomTabs items={tabItems} />
        </>
    );
};

export default Statistical;