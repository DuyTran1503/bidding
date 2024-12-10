import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useArchive } from "@/hooks/useArchive";
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
  detailProjectByIds,
} from "@/services/store/CompareProject/compareProject.thunk";
import Button from "@/components/common/Button";
import { ICompareProjectInitialState } from "@/services/store/CompareProject/compareProject.slice";
import { Col, message, Row } from "antd";
import TableChart from "@/components/chart/TableChart";
import { ICompareProject } from "@/services/store/CompareProject/compareProject.model";
import ProjectDetail from "@/components/chart/ProjectTable";

const Statistical: React.FC = () => {
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateCompare, dispatch: dispatchCompare } = useArchive<ICompareProjectInitialState>("compareproject");
  const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const treeSelectIdsRef = useRef<string[]>([]);
  const previousIdRef = useRef<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("1");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatchProject(getListProject());
    if (id) {
      dispatchProject(getProjectById(id));
    }
  }, [id, dispatchProject]);

  useEffect(() => {
    if (stateProject.listProjects) {
      const formattedData = formatTreeData(stateProject.listProjects);
      setTreeData(formattedData);
    }
  }, [stateProject.listProjects]);

  // useEffect(() => {
  //     const investor = stateProject.project?.investor?.id;
  //     if (investor && !stateChart.employeeEducationLevelStatisticByEnterprise) {
  //         dispatchChart(employeeEducationLevelStatisticByEnterprise(investor));
  //     }
  // }, [stateProject.project, stateChart.employeeEducationLevelStatisticByEnterprise, dispatchChart]);

  const fetchTabData = useCallback(
    (projectIds: string[], tabKey: string) => {
      switch (tabKey) {
        case "1":
          return dispatchCompare(detailProjectByIds({ body: { project_ids: projectIds } }));
        case "2":
          return dispatchCompare(compareBarChartTotalAmount({ body: { project_ids: projectIds } }));
        case "3":
          return dispatchCompare(compareConstructionTime({ body: { project_ids: projectIds } }));
        case "4":
          return dispatchCompare(compareBidSubmissionTime({ body: { project_ids: projectIds } }));
        case "5":
          return dispatchCompare(comparePieChartTotalAmount({ body: { project_ids: projectIds } }));
        case "6":
          return dispatchCompare(compareBidderCount({ body: { project_ids: projectIds } }));
        default:
          return Promise.resolve();
      }
    },
    [dispatchCompare],
  );

  const handleAddToCompare = useCallback(() => {
    const projectId = stateProject.project?.id;
    if (!projectId) return;

    const updatedProjectIds = Array.from(new Set([projectId, ...treeSelectIdsRef.current]));

    if (updatedProjectIds.length > 20) {
      message.warning("Bạn chỉ có thể so sánh tối đa 20 dự án cùng lúc.");
      return;
    }

    localStorage.setItem("selectedProjectIds", JSON.stringify(updatedProjectIds));
    message.success("So sánh thành công", 1);
    fetchTabData(updatedProjectIds, activeTab);
  }, [stateProject.project, fetchTabData, activeTab]);

  useEffect(() => {
    const savedProjectIds = localStorage.getItem("selectedProjectIds");
    if (savedProjectIds) {
      const projectIds = JSON.parse(savedProjectIds);
      treeSelectIdsRef.current = projectIds;
      setSelectedIds(projectIds);

      if (previousIdRef.current != id) {
        fetchTabData(projectIds, activeTab);
      }
    } else if (id && previousIdRef.current !== id) {
      const updatedProjectIds = Array.from(new Set([id, ...treeSelectIdsRef.current]));
      fetchTabData(updatedProjectIds, activeTab);
    }
  }, [fetchTabData, id, activeTab]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("selectedProjectIds");
    };
  }, []);

  const formatTreeData = (data: any[]): { title: string; value: string; key: string; children?: any[] }[] => {
    return data.map((item) => ({
      title: item.name,
      value: item.id.toString(),
      key: item.id.toString(),
      children: item.children ? formatTreeData(item.children) : [],
    }));
  };

  const childChartData = useMemo(() => {
    return stateCompare.comparePieChartTotalAmount
      .filter((item: ICompareProject) => Array.isArray(item.children) && item.children.length > 0)
      .map((item: ICompareProject) => ({
        parentId: item.name,
        children: item.children!.map((child: ICompareProject) => ({
          id: child.id,
          name: child.name,
          value: child.value,
        })),
      }));
  }, [stateCompare.comparePieChartTotalAmount]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // fetchTabData(projectId, key);
  };
  const projectId = stateProject.project?.id;
  const tabItems = [
    {
      key: "1",
      label: "Thống kê dự án",
      content: <ProjectDetail detailProjectByIds={stateCompare.detailProjectByIds} projectId={projectId} />,
    },
    {
      key: "2",
      label: "Biểu đồ so sánh tổng số tiền",
      content: (
        <>
          <GenericChart
            chartType="bar"
            title="Biểu đồ so sánh tổng số tiền"
            name={stateCompare.compareBarChartTotalAmount.map((item) => item.name)}
            value={stateCompare.compareBarChartTotalAmount.map((item) => item.total_amount)}
            grid={120}
            valueType="currency"
            rotate={45}
            colors={stateCompare.compareBarChartTotalAmount.map((item) => (item.id === projectId ? "red" : "#5470C6"))}
          />
          <TableChart
            compareData={stateCompare.compareBarChartTotalAmount.map((item) => ({
              id: String(item.id || ""),
              name: item.name,
              value: item.total_amount,
            }))}
            projectId={projectId}
            valueType="currency"
          />
        </>
      ),
    },
    {
      key: "3",
      label: "Biểu đồ so sánh thời gian thực hiện dự án",
      content: (
        <>
          <GenericChart
            chartType="bar"
            title="Biểu đồ so sánh thời gian thực hiện dự án"
            name={stateCompare.compareConstructionTime.map((item) => item.name)}
            value={stateCompare.compareConstructionTime.map((item) => item.duration)}
            // seriesName="Tổng số tiền"
            grid={120}
            valueType="date"
            colors={stateCompare.compareBarChartTotalAmount.map((item) => (item.id === projectId ? "red" : "#5470C6"))}
          />
          <TableChart
            compareData={stateCompare.compareConstructionTime.map((item) => ({
              id: String(item.id || ""),
              name: item.name,
              value: item.duration,
            }))}
            projectId={projectId}
            valueType="date"
          />
        </>
      ),
    },
    {
      key: "4",
      label: "Biểu đồ so sánh thời gian mở thầu",
      content: (
        <>
          <GenericChart
            chartType="bar"
            title="Biểu đồ so sánh thời gian mở thầu"
            name={stateCompare.compareBidSubmissionTime.map((item) => item.name)}
            value={stateCompare.compareBidSubmissionTime.map((item) => item.duration)}
            seriesName="Ngày"
            grid={120}
            valueType="date"
            colors={stateCompare.compareBidSubmissionTime.map((item) => (item.id === projectId ? "red" : "#5470C6"))}
          />
          <TableChart
            compareData={stateCompare.compareBidSubmissionTime.map((item) => ({
              id: String(item.id || ""),
              name: item.name,
              value: item.duration,
            }))}
            projectId={projectId}
            valueType="date"
          />
        </>
      ),
    },
    {
      key: "5",
      label: "Biểu đồ so sánh tỷ lệ vốn các dự án con của các dự án",
      content: (
        <>
          <GenericChart
            chartType="bar"
            title="Biểu đồ so sánh tỷ lệ vốn các dự án con của các dự án"
            name={stateCompare.comparePieChartTotalAmount.map((item, index) => `${item.name} (${index + 1})`)}
            value={stateCompare.comparePieChartTotalAmount.map((item) => item.value)}
            valueType="currency"
            legendPosition="bottom"
            colors={stateCompare.compareBidSubmissionTime.map((item) => (item.id === projectId ? "red" : "#5470C6"))}
          />
          <Row gutter={[24, 24]} className="mb-8">
            {childChartData.length > 0 &&
              childChartData.map((childData, index) => (
                <Col xs={24} sm={24} md={12} xl={12} key={`child-chart-${index}`}>
                  <GenericChart
                    chartType="pie"
                    title={`${++index} - Biểu đồ chi tiết cho dự án (${childData.parentId})`}
                    name={childData.children.map((child) => child.name)}
                    value={childData.children.map((child) => child.value)}
                    valueType="currency"
                    legendPosition="bottom"
                    rotate={100}
                    titleFontSize={14}
                  />
                </Col>
              ))}
          </Row>
          <TableChart
            compareData={stateCompare.comparePieChartTotalAmount.map((item) => ({
              id: String(item.id || ""),
              name: item.name,
              value: item.value,
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
      label: "Biểu đồ so sánh số lượng nhà thầu tham gia",
      content: (
        <>
          <GenericChart
            chartType="bar"
            title="Biểu đồ so sánh số lượng nhà thầu tham gia"
            name={stateCompare.compareBidderCount.map((item) => item.name)}
            value={stateCompare.compareBidderCount.map((item) => item.bidder_count)}
            seriesName="Số lượng nhà thầu"
            grid={120}
            valueType="quantity"
            colors={stateCompare.compareBidderCount.map((item) => (item.id === projectId ? "red" : "#5470C6"))}
          />
          <TableChart
            compareData={stateCompare.compareBidderCount.map((item) => ({
              id: String(item.id || ""),
              name: item.name,
              value: item.bidder_count,
            }))}
            projectId={projectId}
            valueType="quantity"
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Heading
        title={`Thống kê chi tiết ${stateProject.project?.name || ""}`}
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Quay lại",
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
        // isDisabled={selectedIds.length > 20}
        />
        <Button type="primary" text="Thêm vào so sánh" onClick={handleAddToCompare} className="w-40" />
      </div>
      <CustomTabs selectedKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </>
  );
};

export default Statistical;
