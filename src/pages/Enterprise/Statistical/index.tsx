import AbleBarChart from "@/components/chart/Axis";
import Button from "@/components/common/Button";
import FormGroup from "@/components/form/FormGroup";
import FormSelect from "@/components/form/FormSelect";
import Heading from "@/components/layout/Heading";
import CustomTabs from "@/components/table/CustomTabs";
import { useArchive } from "@/hooks/useArchive";
import { convertDataOptions } from "@/pages/Project/helper";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IChartEnterpriseInitialState } from "@/services/store/enterprise_chart/enterprise_chart.slice";
import {
  averageDifficultyLevelTasksByEnterprise,
  detailEnterpriseByIds,
  getEmployeeProjectStatistic,
  getEmployeeResultBiddingStatistic,
  projectCompletedByEnterprise,
  projectWonByEnterprise,
} from "@/services/store/enterprise_chart/enterprise_chart.thunk";
import { Col, message, Row, Select } from "antd";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import EnterpriseDetail from "./EnterpriseTable";

interface IProp {
  ids: string[] | number[];
  year: string[] | number[];
}

const yearOptions = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(String);

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

  const handleAddToCompare = () => {
    if (ids.length && id) {
      const enterpriseIds = [...new Set([...ids, Number(id)])]; // Combine and remove duplicates
      setSelectedEnterpriseIds(enterpriseIds);
      const selectedYear = year.length ? year : [new Date().getFullYear()];
      message.success("So sánh thành công", 1);

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
          dispatchChartEnterprise(projectCompletedByEnterprise({ body: { ids: enterpriseIds, year: selectedYear } }));
        } else if (selectedTabKey === "6") {
          dispatchChartEnterprise(projectWonByEnterprise({ body: { ids: enterpriseIds, year: selectedYear } }));
          // } else if (selectedTabKey === "7") {
          //   dispatchChartEnterprise(evaluationsStatisticsByEnterprise({ body: { ids: enterpriseIds } }));
          // } else if (selectedTabKey === "8") {
          //   dispatchChartEnterprise(reputationsStatisticsByEnterprise({ body: { ids: enterpriseIds } }));
          // } else if (selectedTabKey === "8") {
          //   dispatchChartEnterprise(averageDifficultyLevelTasksByEmployee({ body: enterpriseIds }));
          // } else if (selectedTabKey === "9") {
          //   dispatchChartEnterprise(averageFeedbackByEmployee({ body: enterpriseIds }));
        }
      }
    }
  };
  useEffect(() => {
    if (selectedTabKey) {
      const enterpriseIds = [...new Set([...ids, Number(id)])]; // Combine and remove duplicates
      setSelectedEnterpriseIds(enterpriseIds);
      const selectedYear = year.length ? year : [new Date().getFullYear()];

      if (selectedTabKey === "1") {
        dispatchChartEnterprise(detailEnterpriseByIds({ body: { ids: enterpriseIds } }));
      } else if (selectedTabKey === "2") {
        dispatchChartEnterprise(getEmployeeProjectStatistic({ body: enterpriseIds }));
      } else if (selectedTabKey === "3") {
        dispatchChartEnterprise(getEmployeeResultBiddingStatistic({ body: enterpriseIds }));
      } else if (selectedTabKey === "4") {
        dispatchChartEnterprise(averageDifficultyLevelTasksByEnterprise({ body: enterpriseIds }));
      } else if (selectedTabKey === "5") {
        dispatchChartEnterprise(projectCompletedByEnterprise({ body: { ids: enterpriseIds, year: selectedYear } }));
      } else if (selectedTabKey === "6") {
        dispatchChartEnterprise(projectWonByEnterprise({ body: { ids: enterpriseIds, year: selectedYear } }));
        // } else if (selectedTabKey === "7") {
        //   dispatchChartEnterprise(evaluationsStatisticsByEnterprise({ body: { ids: enterpriseIds, year: selectedYear } }));
        // } else if (selectedTabKey === "8") {
        //   dispatchChartEnterprise(reputationsStatisticsByEnterprise({ body: { ids: enterpriseIds, year: selectedYear } }));
        // } else if (selectedTabKey === "8") {
        //   dispatchChartEnterprise(averageDifficultyLevelTasksByEmployee({ body: enterpriseIds }));
        // } else if (selectedTabKey === "9") {
        //   dispatchChartEnterprise(averageFeedbackByEmployee({ body: enterpriseIds }));
      }
    }
  }, [selectedTabKey]);
  // const xAxisData = stateChartEnterprise.projectCompletedByEnterprise.flatMap((enterprise) =>
  //   enterprise.monthly_data.map((data) => `Tháng ${data.month}`)
  // );

  // Lọc các tháng có dữ liệu (loại bỏ các tháng không có dữ liệu)
  // const filteredXAxisData = [...new Set(xAxisData)].sort((a, b) => {
  //   const monthA = parseInt(a.split(' ')[1]);
  //   const monthB = parseInt(b.split(' ')[1]);
  //   return monthA - monthB;  // Sắp xếp tháng từ nhỏ đến lớn
  // });

  const enterpriseId = stateEnterprise.enterprise?.id;
  const tabItems = [
    {
      key: "1",
      label: "Thống kê chung",
      content: <EnterpriseDetail detailEnterpriseByIds={stateChartEnterprise.detailEnterpriseByIds} enterpriseId={enterpriseId} />,
    },
    {
      key: "2",
      label: "Biểu đồ dự án đã đăng tải và đã đầu tư của doanh nghiệp",
      content: (
        <AbleBarChart
          data={[
            { name: "Đã đầu tư", values: stateChartEnterprise.getEmployeeProjectStatistic.map((item) => item.tendererProjectCount) },
            { name: "Đã đăng tải", values: stateChartEnterprise.getEmployeeProjectStatistic.map((item) => item.investorProjectCount) },
          ]}
          xAxisData={stateChartEnterprise.getEmployeeProjectStatistic.map(({ enterprise }) => enterprise)}
          title="Biểu đồ thống kê dự án đã đăng tải và đã đầu tư của doanh nghiệp"
        />
      ),
    },
    {
      key: "3",
      label: "Biểu đồ số lượng gói thầu đã trúng ",
      content: (
        <AbleBarChart
          data={[
            { name: "Số dự án", values: stateChartEnterprise.employeeResultBiddingStatistic.map((item) => item.numberProjectWinning) },
            { name: "Số tiền", values: stateChartEnterprise.employeeResultBiddingStatistic.map((item) => item.averageWinningAmount) },
            { name: "Tổng số tiền thắng", values: stateChartEnterprise.employeeResultBiddingStatistic.map((item) => item.totalWinningAmount) },
          ]}
          xAxisData={stateChartEnterprise.employeeResultBiddingStatistic.map(({ enterprise }) => enterprise)}
          title="Biểu đồ thống kê số dự án trúng, giá trúng thầu trung bình và tổng giá trị thầu trúng của doanh nghiệp"
        />
      ),
    },
    
    {
      key: "5",
      label: "Biểu đồ điểm uy tín",
      content: (
        <AbleBarChart
          data={[
            { name: "Điểm uy tín", values: stateChartEnterprise.reputationsStatisticsByEnterprise.map((item) => item.prestige_score) },
            {
              name: "Số lần bị đưa vào danh sách đen",
              values: stateChartEnterprise.reputationsStatisticsByEnterprise.map((item) => item.blacklist_count),
            },
            { name: "Số lần bị khóa tài khoản", values: stateChartEnterprise.reputationsStatisticsByEnterprise.map((item) => item.ban_count) },
          ]}
          xAxisData={stateChartEnterprise.reputationsStatisticsByEnterprise.map(({ enterprise_name }) => enterprise_name)}
          title="Biểu đồ thể hiện điểm uy tín của doanh nghiệp và lịch sử bị trừ điểm uy tín của doanh nghiệp"
        />
      ),
    },
    {
      key: "6",
      label: "Biểu đồ đánh giá doanh nghiệp",
      content: (
        <AbleBarChart
          data={[
            { name: "Tổng số đánh giá", values: stateChartEnterprise.evaluationsStatisticsByEnterprise.map((item) => item.total_evaluations) },
            { name: "Điểm trung bình", values: stateChartEnterprise.evaluationsStatisticsByEnterprise.map((item) => item.average_score) },
          ]}
          xAxisData={stateChartEnterprise.evaluationsStatisticsByEnterprise.map(({ enterprise_name }) => enterprise_name)}
          title="Biểu đồ thể hiện số lượng đánh giá và đánh giá trung bình doanh nghiệp nhận được"
        />
      ),
    },
    // {
    //   key: "7",
    //   label: "Dự án đã trúng thầu",
    //   content: (
    //     <AbleBarChart
    //       title="Biểu đồ thống kê số lượng dự án đã trúng thầu của doanh nghiệp theo từng tháng trong năm"
    //       xAxisData={filteredXAxisData}
    //       data={stateChartEnterprise.projectWonByEnterprise.map((enterprise) => ({
    //         name: enterprise.enterprise_name,
    //         values: enterprise.monthly_data.map((item) => item.won_projects || 0),
    //       }))}

    //     />

    //   ),
    // },
    // {
    //   key: "8",
    //   label: "Dự án đã hoàn thành",
    //   content: (
    //       <AbleBarChart
    //           title="Biểu đồ thống kê số lượng dự án đã hoàn thành của doanh nghiệp theo từng tháng trong năm"
    //           xAxisData={filteredXAxisData}
    //           data={stateChartEnterprise.projectCompletedByEnterprise.map((enterprise) => ({
    //             name: enterprise.enterprise_name,
    //             values: enterprise.monthly_data.map((item) => item.completed_projects || 0),
    //           }))}

    //       />

    //   ),
    // },
  ];
  const initialValues: IProp = {
    ids: ids || [],
    year: year || new Date().getFullYear(),
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
            text: "Quay lại",
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
                <Col xs={24} sm={24} md={24} xl={24}>
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
                        }}
                      />
                      <Select
                        // showLabel={false}
                        className="w-72"
                        placeholder="Chọn năm..."
                        options={yearOptions.map((year) => ({ label: year, value: year }))}
                        value={values.year}
                        onChange={(e) => {
                          setFieldValue("year", e);
                          setYear(e as any);
                        }}
                      />
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
