import React, { useEffect, useState } from "react";
import { Row, Select } from "antd";
import GenericChart from "@/components/chart/GenericChart";
import AreaChart from "@/components/chart/AreaChart";
import { useArchive } from "@/hooks/useArchive";
import { timeJoiningWebsiteOfEnterprise, projectsStatusPreMonth, industryHasTheMostEnterprise, industryHasTheMostProject } from "@/services/store/chart/chart.thunk";
import { IChartInitialState } from "@/services/store/chart/chart.slice";

const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(String);

const EnterpriseYearlyRanking: React.FC = () => {
  const { state, dispatch } = useArchive<IChartInitialState>("chart");
  const [selectedYearTimeJoining, setSelectedYearTimeJoining] = useState<string>(yearOptions[0]);
  const [selectedYearIndustryEnterprise, setSelectedYearIndustryEnterprise] = useState<string>(yearOptions[0]);
  const [selectedYearIndustryProject, setSelectedYearIndustryProject] = useState<string>(yearOptions[0]);
  const [selectedYearProjectStatus, setSelectedYearProjectStatus] = useState<string>(yearOptions[0]);

  useEffect(() => {
    if (selectedYearTimeJoining) {
      dispatch(timeJoiningWebsiteOfEnterprise({ body: { year: selectedYearTimeJoining } }));
    }
  }, []);

  useEffect(() => {
    if (selectedYearIndustryEnterprise) {
      dispatch(industryHasTheMostEnterprise({ body: { year: selectedYearIndustryEnterprise } }));
    }
  }, [ ]);

  useEffect(() => {
    if (selectedYearIndustryProject) {
      dispatch(industryHasTheMostProject({ body: { year: selectedYearIndustryProject } }));
    }
  }, []);

  useEffect(() => {
    if (selectedYearProjectStatus) {
      dispatch(projectsStatusPreMonth({ body: { year: selectedYearProjectStatus } }));
    }
  }, [ ]);

  const completedValues = state.projectsStatusPreMonth?.completed?.map((item: number) => Object.values(item)[0]);
  const approvedValues = state.projectsStatusPreMonth?.approved?.map((item: number) => Object.values(item)[0]);
  const openedBiddingValues = state.projectsStatusPreMonth?.opened_bidding?.map((item: number) => Object.values(item)[0]);
 
  return (
    <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">5. Bảng xếp hạng Doanh Nghiệp theo năm</h2>
        <Row gutter={[24, 24]}>
          <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
            <Select
              placeholder="Chọn năm..."
              value={selectedYearTimeJoining}
              onChange={setSelectedYearTimeJoining}
              options={yearOptions.map((year) => ({ label: year, value: year }))}
              style={{ width: 150, marginBottom: 16 }}
            />
            <GenericChart
              name={Object.keys(state.timeJoiningWebsiteOfEnterprise)}
              value={Object.values(state.timeJoiningWebsiteOfEnterprise)}
              chartType="line"
              seriesName="Dữ liệu theo tháng"
              title="Biểu đồ thể hiện số lượng doanh nghiệp tham gia hệ giống theo tháng trong năm"
              tooltipEnabled
              legendPosition="bottom"
            />
          </div>
          <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
            <Select
              placeholder="Chọn năm..."
              value={selectedYearIndustryEnterprise}
              onChange={setSelectedYearIndustryEnterprise}
              options={yearOptions.map((year) => ({ label: year, value: year }))}
              style={{ width: 150, marginBottom: 16 }}
            />
            <GenericChart
              name={state.industryHasTheMostEnterprise.map(({ industry }) => industry)}
              value={state.industryHasTheMostEnterprise.map(({ total_enterprise }) => total_enterprise)}
              chartType="bar"
              title="Biểu đồ số lượng dự án phân bổ theo ngành nghề"
            />
          </div>
          <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
            <Select
              placeholder="Chọn năm..."
              value={selectedYearIndustryProject}
              onChange={setSelectedYearIndustryProject}
              options={yearOptions.map((year) => ({ label: year, value: year }))}
              style={{ width: 150, marginBottom: 16 }}
            />
            <GenericChart
              name={state.industryHasTheMostProject.map(({ industry }) => industry)}
              value={state.industryHasTheMostProject.map(({ total_project }) => total_project)}
              chartType="bar"
              title="Biểu đồ số lượng doanh nghiệp phân bổ theo ngành nghề"
            />
          </div>
          <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
            <Select
              placeholder="Chọn năm..."
              value={selectedYearProjectStatus}
              onChange={setSelectedYearProjectStatus}
              options={yearOptions.map((year) => ({ label: year, value: year }))}
              style={{ width: 150, marginBottom: 16 }}
            />
            <AreaChart
              series={[
                { name: "Hoàn thành", data: completedValues },
                { name: "Phê duyệt", data: approvedValues },
                { name: "Mở thầu", data: openedBiddingValues },
              ]}
              categories={state.projectsStatusPreMonth?.completed?.map((item: string) => Object.keys(item)[0]) || []}
              title="Sales Dashboard"
            />
          </div>
          {/* <AreaChart /> */}
        </Row>
      </div>
  );
};

export default EnterpriseYearlyRanking;
