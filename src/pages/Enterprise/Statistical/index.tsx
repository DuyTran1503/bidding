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
import { unwrapResult } from "@reduxjs/toolkit";
import { compareBarChartTotalAmount } from "@/services/store/CompareProject/compareProject.thunk";
import Button from "@/components/common/Button";
import { ICompareProjectInitialState } from "@/services/store/CompareProject/compareProject.slice";
import { employeeEducationLevelStatisticByEnterprise, projectByFundingsource, projectByIndustry } from "@/services/store/chart/chart.thunk";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getIndustries } from "@/services/store/industry/industry.thunk";
import { getEnterpriseById } from "@/services/store/enterprise/enterprise.thunk";
import { IChartEnterpriseInitialState } from "@/services/store/enterprise_chart/enterprise_chart.slice";
import FormSelect from "@/components/form/FormSelect";
import { IOption } from "@/shared/utils/shared-interfaces";
import { convertDataOptions } from "@/pages/Project/helper";

const StatisticalEnterprise: React.FC = () => {
  const { id } = useParams();
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: stateChartEnterprise, dispatch: dispatchChartEnterprise } = useArchive<IChartEnterpriseInitialState>("chart_enterprise");
  const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[] | string[]>([]);
  const [treeSelectIds, setTreeSelectIds] = useState<string[] | string>([]);
  const [compareData, setCompareData] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    dispatchEnterprise(getIndustries());
  }, [dispatchEnterprise]);

  useEffect(() => {
    !!id && dispatchEnterprise(getEnterpriseById(id));
  }, [id]);

  const handleAddToCompare = () => {
    const id = stateEnterprise.enterprise.id;
    // Tạo mảng project_ids và thêm investorId nếu có
    const updatedProjectIds = [...new Set([...treeSelectIds])]; // Kết hợp và loại bỏ trùng lặp
    updatedProjectIds.push(id); // Thêm investorId vào mảng
    setSelectedProjectIds(updatedProjectIds);
  };

  const nameMapping: Record<string, string> = {
    after_university: "Sau đại học",
    university: "Đại học",
    college: "Cao đẳng",
    high_school: "Trung học phổ thông",
    secondary_school: "Trung học cơ sở",
    primary_school: "Tiểu học",
  };
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
          name={stateChartEnterprise.salaryOfEmployees.map(({ enterprise }) => enterprise)}
          value={stateChartEnterprise.salaryOfEmployees.map((item) => item.salaryAvg)}
          seriesName="Dữ liệu Ngành"
        />
      ),
    },
  ];

  return (
    <>
      <Heading
        title={"Thống kê chi tiết " + (stateEnterprise.enterprise?.name || "")}
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/enterprise");
            },
          },
        ]}
      />
      <FormSelect
        placeholder="Chọn doanh nghiệp..."
        value={convertDataOptions(stateEnterprise.listEnterprise || [])}
        width="400px"
        isMultiple
        onChange={(value) => setTreeSelectIds(value)}
      ></FormSelect>
      <Button type="primary" text="Thêm vào so sánh" onClick={handleAddToCompare} isDisabled={treeSelectIds.length === 0} />
      <CustomTabs items={tabItems} />
    </>
  );
};

export default StatisticalEnterprise;
