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
  detailProjectByIds,
} from "@/services/store/CompareProject/compareProject.thunk";
import Button from "@/components/common/Button";
import { ICompareProjectInitialState } from "@/services/store/CompareProject/compareProject.slice";
import { projectByFundingsource, projectByIndustry } from "@/services/store/chart/chart.thunk";
import { Col, message, Row, Spin } from "antd";
import TableChart from "@/components/chart/TableChart";
import { ICompareProject } from "@/services/store/CompareProject/compareProject.model";
import ProjectDetail from "@/components/chart/ProjectTable";
import { RootStateType } from "@/services/reducers";
import { useSelector } from "react-redux";

const Statistical: React.FC = () => {
  const { state: stateChart, dispatch: dispatchChart } = useArchive<IChartInitialState>("chart");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateCompare, dispatch: dispatchCompare } = useArchive<ICompareProjectInitialState>("compareproject");
  const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const treeSelectIdsRef = useRef<string[]>([]);
  const previousIdRef = useRef<string | undefined>(undefined);
  const loading = useSelector((state: RootStateType) => state.chart.loading);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatchProject(getListProject());
    dispatchChart(projectByIndustry({}));
    dispatchChart(projectByFundingsource({}));
    if (id) {
      dispatchProject(getProjectById(id));
    }
  }, [id, dispatchChart, dispatchProject]);

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

  const fetchAllTabData = useCallback(
    (projectIds: string[]) => {
      const fetchPromises = [
        dispatchCompare(detailProjectByIds({ body: { project_ids: projectIds } })),
        dispatchCompare(compareBarChartTotalAmount({ body: { project_ids: projectIds } })),
        dispatchCompare(compareConstructionTime({ body: { project_ids: projectIds } })),
        dispatchCompare(compareBidSubmissionTime({ body: { project_ids: projectIds } })),
        dispatchCompare(comparePieChartTotalAmount({ body: { project_ids: projectIds } })),
        dispatchCompare(compareBidderCount({ body: { project_ids: projectIds } })),
      ];
      return Promise.all(fetchPromises);
    },
    [dispatchCompare],
  );

  const handleAddToCompare = useCallback(() => {
    const projectId = stateProject.project?.id;
    if (!projectId) return;

    const updatedProjectIds = Array.from(new Set([projectId, ...treeSelectIdsRef.current]));

    if (updatedProjectIds.length > 20) {
      message.warning("Bạn chỉ có thể so sánh tối đa 5 dự án cùng lúc.");
      return;
    }

    localStorage.setItem("selectedProjectIds", JSON.stringify(updatedProjectIds));
    // console.log("hahaa");
    message.loading("Đang so sánh...");
    fetchAllTabData(updatedProjectIds)
      .then(() => {
        message.success("So sánh thành công!");
      })
      .catch(() => {
        message.error("Có lỗi xảy ra trong quá trình so sánh.");
      });
  }, [stateProject.project, fetchAllTabData]);

  useEffect(() => {
    const savedProjectIds = localStorage.getItem("selectedProjectIds");
    if (savedProjectIds) {
      const projectIds = JSON.parse(savedProjectIds);
      treeSelectIdsRef.current = projectIds;
      setSelectedIds(projectIds);

      if (previousIdRef.current != id) {
        // console.log("hehe", projectIds);
        message.loading("Đang tải lại dữ liệu so sánh...");
        fetchAllTabData(projectIds);
      }
    } else if (id && previousIdRef.current !== id) {
      const updatedProjectIds = Array.from(new Set([id, ...treeSelectIdsRef.current]));
      // console.log("huhu");
      message.loading("Đang tải dữ liệu");
      fetchAllTabData(updatedProjectIds);
    }
  }, [fetchAllTabData, id]);

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

  // console.log(stateCompare.detailProjectByIds);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-lvh">
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }
  const projectId = stateProject.project?.id;
  const tabItems = useMemo(
    () => [
      {
        key: "1",
        label: "Thống kê dự án",
        content: <ProjectDetail detailProjectByIds={stateCompare.detailProjectByIds} projectId={projectId} />,
      },
      {
        key: "2",
        label: "Tổng số tiền",
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
        label: "Thời gian thực hiện dự án",
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
        label: "Thời gian mở thầu",
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
        label: "Tỷ lệ vốn các project con của các dự án ",
        content: (
          <>
            <GenericChart
              chartType="bar"
              title="Biểu đồ so sánh tỷ lệ vốn các project con của các dự án "
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
        label: "Số lượng nhà thầu tham gia",
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
    ],
    [stateCompare, stateChart, id],
  );

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
        <Button type="primary" text="Thêm vào so sánh" onClick={handleAddToCompare} className="w-40" />
      </div>
      <CustomTabs items={tabItems} />
    </>
  );
};

export default Statistical;
