import React, { useEffect, useState } from "react";
import { useArchive } from "@/hooks/useArchive";
import CustomTabs from "@/components/table/CustomTabs";
import Heading from "@/components/layout/Heading";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@/components/common/Button";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getEnterpriseById, getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IChartEnterpriseInitialState } from "@/services/store/enterprise_chart/enterprise_chart.slice";
import FormSelect from "@/components/form/FormSelect";
import { convertDataOptions } from "@/pages/Project/helper";
import { Form, Formik } from "formik";
import FormGroup from "@/components/form/FormGroup";
import { Col, Row } from "antd";
import {
  averageDifficultyLevelTasksByEmployee,
  averageDifficultyLevelTasksByEnterprise,
  averageFeedbackByEmployee,
  detailEnterpriseByIds,
  getEmployeeProjectStatistic,
  getEmployeeResultBiddingStatistic,
  projectCompletedByEnterprise,
  projectWonByEnterprise,
} from "@/services/store/enterprise_chart/enterprise_chart.thunk";
import EnterpriseDetail from "./EnterpriseTable";
import GenericChart from "@/components/chart/GenericChart";
import AbleBarChart from "@/components/chart/Axis";

interface IProp {
  ids: string[] | number[];
  year: string[] | number[];
}

const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(String);

const StatisticalEnterprise: React.FC = () => {
  const { id } = useParams();

  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: stateChartEnterprise, dispatch: dispatchChartEnterprise } = useArchive<IChartEnterpriseInitialState>("chart_enterprise");
  const [, setSelectedEnterpriseIds] = useState<number[] | string[]>([]);
  const [ids, setIds] = useState<number[]>([]);
  const [year, setYear] = useState<number[]>([]);
  const [selectedTabKey, setSelectedTabKey] = useState("1");

  const navigate = useNavigate();

  useEffect(() => {
    dispatchEnterprise(getListEnterprise());
  }, [dispatchEnterprise]);

  useEffect(() => {
    !!id && dispatchEnterprise(getEnterpriseById(id));
  }, [id]);

  const handleAddToCompare = () => {
    if (ids.length && id) {
      const enterpriseIds = [...new Set([...ids, Number(id)])]; // Combine and remove duplicates
      setSelectedEnterpriseIds(enterpriseIds);

      if (enterpriseIds.length > 1) {
        if (selectedTabKey === "1") {
          dispatchChartEnterprise(detailEnterpriseByIds({ body: { ids: enterpriseIds } }));
        } else if (selectedTabKey === "2") {
          dispatchChartEnterprise(getEmployeeProjectStatistic({ body: enterpriseIds }));
        } else if (selectedTabKey === "3") {
          dispatchChartEnterprise(getEmployeeResultBiddingStatistic({ body: enterpriseIds }));
        } else if (selectedTabKey === "4") {
          dispatchChartEnterprise(averageDifficultyLevelTasksByEnterprise({ body: enterpriseIds }));
        } else if (selectedTabKey === "5") {
          dispatchChartEnterprise(averageDifficultyLevelTasksByEmployee({ body: enterpriseIds }));
        } else if (selectedTabKey === "6") {
          dispatchChartEnterprise(averageFeedbackByEmployee({ body: enterpriseIds }));
        } else if (selectedTabKey === "7") {
          dispatchChartEnterprise(projectCompletedByEnterprise({ body: { ids: enterpriseIds, year: year } }));
        } else if (selectedTabKey === "8") {
          dispatchChartEnterprise(projectWonByEnterprise({ body: { ids: enterpriseIds, year: year } }));
        }
      }
    }
  };
  useEffect(() => {
    if (selectedTabKey) {
      const enterpriseIds = [...new Set([...ids, Number(id)])]; // Combine and remove duplicates
      setSelectedEnterpriseIds(enterpriseIds);

      if (selectedTabKey === "1") {
        dispatchChartEnterprise(detailEnterpriseByIds({ body: { ids: enterpriseIds } }));
      } else if (selectedTabKey === "2") {
        dispatchChartEnterprise(getEmployeeProjectStatistic({ body: enterpriseIds }));
      } else if (selectedTabKey === "3") {
        dispatchChartEnterprise(getEmployeeResultBiddingStatistic({ body: enterpriseIds }));
      } else if (selectedTabKey === "4") {
        dispatchChartEnterprise(averageDifficultyLevelTasksByEnterprise({ body: enterpriseIds }));
      } else if (selectedTabKey === "5") {
        dispatchChartEnterprise(averageDifficultyLevelTasksByEmployee({ body: enterpriseIds }));
      } else if (selectedTabKey === "6") {
        dispatchChartEnterprise(averageFeedbackByEmployee({ body: enterpriseIds }));
      } else if (selectedTabKey === "7") {
        dispatchChartEnterprise(projectCompletedByEnterprise({ body: { ids: enterpriseIds, year: year } }));
      } else if (selectedTabKey === "8") {
        dispatchChartEnterprise(projectWonByEnterprise({ body: { ids: enterpriseIds, year: year } }));
      }
    }
  }, [selectedTabKey]);

  // const nameMapping: Record<string, string> = {
  //   after_university: "Sau đại học",
  //   university: "Đại học",
  //   college: "Cao đẳng",
  //   high_school: "Trung học phổ thông",
  //   secondary_school: "Trung học cơ sở",
  //   primary_school: "Tiểu học",
  // };

  const enterpriseId = stateEnterprise.enterprise?.id;
  const tabItems = [
    {
      key: "1",
      label: "Biểu đồ thống kê số lượng dự án của doanh nghiệp",
      content: (
        <EnterpriseDetail detailEnterpriseByIds={stateChartEnterprise.detailEnterpriseByIds} enterpriseId={enterpriseId} />
      ),
    },
    {
      key: "2",
      label: "Biểu đồ thống kê số lượng dự án của doanh nghiệp",
      content: (
        <AbleBarChart
          data={[
            { name: "Đã đầu tư", values: stateChartEnterprise.getEmployeeProjectStatistic.map((item) => item.tendererProjectCount) },
            { name: "Đã đăng tải", values: stateChartEnterprise.getEmployeeProjectStatistic.map((item) => item.investorProjectCount) },
          ]}
          xAxisData={stateChartEnterprise.getEmployeeProjectStatistic.map(({ enterprise }) => enterprise)}
          title="Biểu đồ thống kê dự án đã đăng tải và dự án đã đầu tư của doanh nghiệp" />
      ),
    },
    {
      key: "3",
      label: "Thống kê số lượng gói thâu đã trúng ",
      content: (
        <AbleBarChart
          data={[
            { name: "Số dự án", values: stateChartEnterprise.employeeResultBiddingStatistic.map((item) => item.numberProjectWinning) },
            { name: "Số tiền", values: stateChartEnterprise.employeeResultBiddingStatistic.map((item) => item.averageWinningAmount) },
            { name: "Tổng số tiền thắng", values: stateChartEnterprise.employeeResultBiddingStatistic.map((item) => item.totalWinningAmount) },
          ]}
          xAxisData={stateChartEnterprise.employeeResultBiddingStatistic.map(({ enterprise }) => enterprise)}
          title="Biểu đồ thống kê số lượng dự án đã trúng,giá trúng thầu trung bình và tổng giá trị thầu đã trúng của doanh nghiệp" />
      ),
    },
    {
      key: "4",
      label: "Biểu đồ thể hiện độ khó trung bình của nhiệm vụ mà doanh nghiệp thực hiện",
      content: (
        <GenericChart
          chartType="bar"
          grid={120}
          title="Biểu đồ thể hiện độ khó trung bình của nhiệm vụ mà doanh nghiệp thực hiện"
          name={stateChartEnterprise.averageDifficultyLevelTasksByEnterprise.map(({ enterprise_name }) => enterprise_name)}
          value={stateChartEnterprise.averageDifficultyLevelTasksByEnterprise.map((item) => item.average_difficulty)}
          seriesName="Mức độ khó khăn trung bình"
        />

      ),
    },
    {
      key: "5",
      label: "Biểu đồ thể hiện độ khó trung bình của nhiệm vụ mà nhân viên thực hiện",
      content: (
        <GenericChart
          chartType="bar"
          grid={120}
          title="Biểu đồ thể hiện độ khó trung bình của nhiệm vụ mà nhân viên thực hiện"
          name={stateChartEnterprise.averageDifficultyLevelTasksByEmployee.map(({ employee_name }) => employee_name)}
          value={stateChartEnterprise.averageDifficultyLevelTasksByEmployee.map((item) => item.average_difficulty)}
          seriesName="Mức độ khó khăn trung bình"
        />

      ),
    },
    {
      key: "6",
      label: "Biểu đồ thống kê đánh giá trung bình của nhân viên",
      content: (
        <GenericChart
          chartType="bar"
          grid={120}
          title="Biểu đồ thống kê đánh giá trung bình của nhân viên"
          name={stateChartEnterprise.averageFeedbackByEmployee.map(({ employee_name }) => employee_name)}
          value={stateChartEnterprise.averageFeedbackByEmployee.map((item) => item.average_feedback)}
          seriesName="Mức độ khó khăn trung bình"
        />

      ),
    },
    {
      key: "7",
      label: "Biểu đồ thống kê số lượng dự án đã hoàn thành của doanh nghiệp theo từng tháng trong năm",
      content: (
        <AbleBarChart
          title="Biểu đồ thống kê số lượng dự án đã hoàn thành của doanh nghiệp theo từng tháng trong năm"
          xAxisData={Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)}
          data={stateChartEnterprise.projectCompletedByEnterprise.map((enterprise) => ({
            name: enterprise.enterprise_name,
            values: enterprise.monthly_data.map((item) => item.completed_projects || 0),
          }))}

        />
      ),
    },
    {
      key: "8",
      label: "Biểu đồ thống kê số lượng dự án đã trúng thầu của doanh nghiệp theo từng tháng trong năm",
      content: (
        <AbleBarChart
          title="Biểu đồ thống kê số lượng dự án đã hoàn thành của doanh nghiệp theo từng tháng trong năm"
          xAxisData={Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)}
          data={stateChartEnterprise.projectWonByEnterprise.map((enterprise) => ({
            name: enterprise.enterprise_name,
            values: enterprise.monthly_data.map((item) => item.won_projects || 0),
          }))}

        />

      ),
    },
  ];
  const initialValues: IProp = {
    ids: ids || [],
    year: year || [],
  };
  const handleTabChange = (key: string) => {
    setSelectedTabKey(key);
  };
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
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={() => {
          handleAddToCompare();
        }}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <Row className="items-center">
                <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                  <FormGroup title="Doanh nghiệp" className="bg-[#f9f9fc]">
                    <div className="flex w-full gap-4">
                      <FormSelect
                        showLabel={false}
                        placeholder="Chọn doanh nghiệp..."
                        options={convertDataOptions(stateEnterprise.listEnterprise || []).map((option) => ({
                          ...option,
                          disabled: values.ids.includes(id as never), // Disable if the ID is in values.ids
                        }))}
                        value={values.ids}
                        isMultiple
                        onChange={(e) => {
                          setFieldValue("ids", e);
                          setIds(e as any);
                        }} />
                      <FormSelect
                        showLabel={false}
                        className="w-80"
                        placeholder="Chọn năm..."
                        options={yearOptions.map((year) => ({ label: year, value: year }))}
                        value={values.year}
                        onChange={(e) => {
                          setFieldValue("year", e);
                          setYear(e as any);
                        }} />
                      <Button className="w-48" type="primary" text="So sánh" kind="submit" isDisabled={ids.length === 0} />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
      <CustomTabs items={tabItems} selectedKey={selectedTabKey} onChange={handleTabChange} />
      {/* {tabItems.find((item) => item.key === selectedTabKey)?.content} */}
    </>
  );
};

export default StatisticalEnterprise;
