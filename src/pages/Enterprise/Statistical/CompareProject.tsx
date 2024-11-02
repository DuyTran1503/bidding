import React, { useEffect, useState } from "react";
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
import useFetchStatus from "@/hooks/useFetchStatus";
import { unwrapResult } from "@reduxjs/toolkit";
import { compareBarChartTotalAmount } from "@/services/store/CompareProject/compareProject.thunk";
import Button from "@/components/common/Button";
import { ICompareProjectInitialState, resetStatus } from "@/services/store/CompareProject/compareProject.slice";
import { employeeEducationLevelStatisticByEnterprise, projectByFundingsource, projectByIndustry } from "@/services/store/chart/chart.thunk";
interface IEducationMapping {
  [key: string]: string; // Chỉ định rằng tất cả các khóa là chuỗi và giá trị cũng là chuỗi
}
const Statistical: React.FC = () => {
  const { state: stateChart, dispatch: dispatchChart } = useArchive<IChartInitialState>("chart");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateCompare, dispatch: dispatchCompare } = useArchive<ICompareProjectInitialState>("compareproject");
  const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[] | string[]>([]);
  const [treeSelectIds, setTreeSelectIds] = useState<string[] | string>([]);
  const [compareData, setCompareData] = useState<any[]>([]);

  const navigate = useNavigate();
  const { id } = useParams();

  useFetchStatus({
    module: "compareproject",
    reset: resetStatus,
    actions: {
      success: {
        message: stateCompare.message,
      },
      error: {
        message: stateCompare.message,
      },
    },
  });

  useEffect(() => {
    dispatchChart(projectByIndustry({}));
    dispatchChart(projectByFundingsource({}));
    dispatchProject(getListProject())
      .then(unwrapResult)
      .then((result) => {
        const fields = result.data;
        const formattedData = formatTreeData(fields);
        setTreeData(formattedData);
      });
  }, [dispatchProject]);

  useEffect(() => {
    if (id) {
      dispatchProject(getProjectById(id));
    }
  }, [id, dispatchProject]);

  useEffect(() => {
    if (selectedProjectIds.length > 0) {
      dispatchCompare(compareBarChartTotalAmount({ body: { projects_ids: selectedProjectIds } }))
        .then(unwrapResult)
        .then((data) => {
          setCompareData(data as any[]);
        });
    }
  }, [selectedProjectIds, dispatchCompare]);

  useEffect(() => {
    const investorId = stateProject.project?.investor?.id;
    dispatchChart(employeeEducationLevelStatisticByEnterprise(investorId));
  }, [stateProject.project, dispatchChart]);

  const handleAddToCompare = () => {
    const investorId = stateProject.project?.investor?.id;
    setSelectedProjectIds([...new Set([...treeSelectIds, investorId].filter(Boolean))]);
  };

  const educationData = stateChart.employeeEducationLevelStatisticByEnterprise || {};
  const names = Object.keys(educationData);
  const values = Object.values(educationData).map((value) => Number(value));
  const nameMapping: IEducationMapping = {
    after_university: "Sau đại học",
    university: "Đại học",
    college: "Cao đẳng",
    high_school: "Trung học phổ thông",
    secondary_school: "Trung học cơ sở",
    primary_school: "Tiểu học",
  };
  const translatedNames = names.map((name) => nameMapping[name] || name);
  const formatTreeData = (data: any[]): { title: string; value: string; key: string; children?: any[] }[] => {
    return data.map((item) => ({
      title: item.name,
      value: item.id.toString(),
      key: item.id.toString(),
      children: item.children ? formatTreeData(item.children) : [],
    }));
  };

  const tabItems = [
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
          name={compareData.map((item) => item.name)}
          value={compareData.map((item) => item.total_amount)}
          seriesName="Tổng số tiền"
          legendPosition="bottom"
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
          name={translatedNames}
          value={values}
          seriesName="Trình độ học vấn"
        />
      ),
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
      <FormTreeSelect placeholder="So sánh với dự án..." treeData={treeData} width="400px" multiple onChange={(value) => setTreeSelectIds(value)} />
      <Button type="primary" text="Thêm vào so sánh" onClick={handleAddToCompare} isDisabled={treeSelectIds.length === 0} />
      <CustomTabs items={tabItems} />
    </>
  );
};

export default Statistical;