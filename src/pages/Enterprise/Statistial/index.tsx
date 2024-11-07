import GenericChart from "@/components/chart/GenericChart";
import Button from "@/components/common/Button";
import FormTreeSelect from "@/components/form/FormTreeSelect";
import Heading from "@/components/layout/Heading";
import CustomTabs from "@/components/table/CustomTabs";
import { useArchive } from "@/hooks/useArchive";
import { IAvgDifficultyOfTheTaskEnterpriseInitialState } from "@/services/store/avgDifficultyOfTheTask/avgDifficultyOfTheTask.slice";
import { detailEnterpriseByIds } from "@/services/store/avgDifficultyOfTheTask/avgDifficultyOfTheTask.thunk";
import { IChartInitialState } from "@/services/store/chart/chart.slice";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { getProjectById } from "@/services/store/project/project.thunk";
import { message } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

const Statistical: React.FC = () => {
    const { state: stateChart, dispatch: dispatchChart } = useArchive<IChartInitialState>("chart");
    const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
    const { state: stateDifficulty, dispatch: dispatchDiffculty } = useArchive<IAvgDifficultyOfTheTaskEnterpriseInitialState>("avgDifficultyByEnterprise");
    const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const treeSelectIdsRef = useRef<string[]>([]);
    const previousIdRef = useRef<string | undefined>(undefined);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        dispatchEnterprise(getListEnterprise());
        if (id) {
            dispatchEnterprise(getProjectById(id));
        }
    }, [id, dispatchChart, dispatchEnterprise]);

    useEffect(() => {
        if (stateEnterprise.listEnterprise) {
            const formattedData = formatTreeData(stateEnterprise.listEnterprise);
            setTreeData(formattedData);
        }
    }, [stateEnterprise.listEnterprise]);

    // useEffect(() => {
    //     const investor = stateProject.project?.investor?.id;
    //     if (investor && !stateChart.employeeEducationLevelStatisticByEnterprise) {
    //         dispatchChart(employeeEducationLevelStatisticByEnterprise(investor));
    //     }
    // }, [stateProject.project, stateChart.employeeEducationLevelStatisticByEnterprise, dispatchChart]);

    const fetchAllTabData = useCallback((enterpriseIds: string[]) => {
        const fetchPromises = [
            dispatchDiffculty(detailEnterpriseByIds({ body: { enterprise_ids: enterpriseIds } })),

        ];
        return Promise.all(fetchPromises);
    }, [dispatchDiffculty]);

    const handleAddToDiffculty = useCallback(() => {
        const enterprisetId = stateEnterprise.enterprise?.id;
        if (!enterprisetId) return;

        const updatedEnterpriseIds = Array.from(new Set([enterprisetId, ...treeSelectIdsRef.current]));

        if (updatedEnterpriseIds.length > 20) {
            message.warning("Bạn chỉ có thể so sánh tối đa 5 dự án cùng lúc.");
            return;
        }   

        localStorage.setItem("selectedEntrepriseIds", JSON.stringify(updatedEnterpriseIds));
        // console.log("hahaa");
        message.loading("Đang so sánh...");
        fetchAllTabData(updatedEnterpriseIds)
            .then(() => {
                message.success("So sánh thành công!");
            })
            .catch(() => {
                message.error("Có lỗi xảy ra trong quá trình so sánh.");
            });
    }, [stateEnterprise.enterprise, fetchAllTabData]);

    useEffect(() => {
        const savedEnterpriseIds = localStorage.getItem("selectedEnterpriseIds");
        if (savedEnterpriseIds) {
            const enterpriseIds = JSON.parse(savedEnterpriseIds);
            treeSelectIdsRef.current = enterpriseIds;
            setSelectedIds(enterpriseIds);

            if (previousIdRef.current != id) {
                // console.log("hehe", projectIds);
                message.loading("Đang tải lại dữ liệu so sánh...");
                fetchAllTabData(enterpriseIds)
            }
        } else if (id && previousIdRef.current !== id) {
            const updatedEnterpriseIds = Array.from(new Set([id, ...treeSelectIdsRef.current]));
            // console.log("huhu");
            message.loading("Đang tải dữ liệu");
            fetchAllTabData(updatedEnterpriseIds)
        }
    }, [fetchAllTabData, id]);

    useEffect(() => {
        return () => {
            localStorage.removeItem("selectedEnterpriseIds");
        };
    }, []);

    const formatTreeData = (data: any[]): { title: string; value: string; key: string;  }[] => {
        return data.map((item) => ({
            title: item.name,
            value: item.id.toString(),
            key: item.id.toString(),
        }));
    };

    // console.log(stateEnterprise.detailProjectByIds);

    const enterprisetId = stateEnterprise.enterprise?.id;
    const tabItems = useMemo(() => [
        // {
        //     key: "1",
        //     label: "Thống kê dự án",
        //     content: (
        //         <ProjectDetail detailProjectByIds={stateEnterprise.detailProjectByIds} projectId={projectId} />
        //     ),
        // },
        {
            key: "2",
            label: "Độ khó của dự án",
            content: (
                <>
                    <GenericChart
                        chartType="bar"
                        title="Biểu đồ so sánh tổng số tiền"
                        name={stateDifficulty.avgDifficultyByEnterprise.map(item => item.name)}
                        value={stateDifficulty.avgDifficultyByEnterprise.map(item => item.id)}
                        grid={120}
                        valueType="currency"
                        rotate={45}
                        // colors={stateDifficulty.avgDifficultyByEnterprise.map(item =>
                        //     item.id === projectId ? "red" : "#5470C6"
                        // )}
                    />
                    {/* <TableChart
                        compareData={stateDifficulty.avgDifficultyByEnterprise.map(item => ({
                            id: String(item.id || ""),
                            name: item.name,
                            // value: item.total_amount
                        }))}
                        projectId={enterprisetId}
                        valueType="currency"
                    /> */}
                </>
            ),
        },

    ], [stateDifficulty, stateChart, id]);

    return (
        <>
            <Heading
                title={`Thống kê chi tiết`}
                hasBreadcrumb
                buttons={[
                    {
                        type: "secondary",
                        text: "Hủy",
                        icon: <IoClose className="text-[18px]" />,
                        onClick: () => navigate(-1),
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
                    onClick={handleAddToDiffculty}
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
