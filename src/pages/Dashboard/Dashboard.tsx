/* eslint-disable max-len */
// Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useArchive } from "@/hooks/useArchive";
import { IChartInitialState } from "@/services/store/chart/chart.slice";
import {
  averageProjectPurationByIndustry,
  industryHasTheMostEnterprise,
  industryHasTheMostProject,
  projectByDomestic,
  projectByFundingsource,
  projectByIndustry,
  projectByOrganizationType,
  projectBySelectionMethod,
  projectBySubmissionMethod,
  projectByTendererInvestor,
  projectsStatusPreMonth,
  timeJoiningWebsiteOfEnterprise,
  topEnterprisesHaveCompletedProjectsByFundingSource,
  topEnterprisesHaveCompletedProjectsByIndustry,
  topInvestorsByProjectFull,
  topInvestorsByProjectPartial,
  topInvestorsByProjectTotalAmount,
  topTendersByProjectCount,
  topTendersByProjectTotalAmount,
} from "@/services/store/chart/chart.thunk";
import Heading from "@/components/layout/Heading";
import { Col, Row, Select } from "antd";
import { Link } from "react-router-dom";
import ChartSection from "@/components/chart/ChartSection";
import { getListFundingSource } from "@/services/store/funding_source/funding_source.thunk";
import { IFundingSourceInitialState } from "@/services/store/funding_source/funding_source.slice";
import { IIndustryInitialState } from "@/services/store/industry/industry.slice";
import { getIndustries } from "@/services/store/industry/industry.thunk";
import TopEnterpriseChart from "./TopEnterpriseChart";
import GenericChart from "@/components/chart/GenericChart";
import { IChart } from "@/services/store/chart/chart.model";

const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(String);
const Dashboard: React.FC = () => {
  const { state, dispatch } = useArchive<IChartInitialState>("chart");
  // const { state, dispatch } = useArchive<IChartInitialState>("chart");
  const { state: stateFundingSource, dispatch: dispatchFundingSource } = useArchive<IFundingSourceInitialState>("funding_source");
  const { state: stateIndustry, dispatch: dispatchIndustry } = useArchive<IIndustryInitialState>("industry");
  const [selectedYear, setSelectedYear] = useState<string>(yearOptions[0]);

  const [selectedFundingSource, setSelectedFundingSource] = useState<string>();
  const [selectedIndustry, setSelectedIndustry] = useState<string>();

  useEffect(() => {
    dispatch(projectByIndustry({}));
    dispatch(projectByFundingsource({}));
    dispatch(averageProjectPurationByIndustry({}));
    dispatch(projectByDomestic({}));
    dispatch(projectByOrganizationType({}));
    dispatch(projectBySelectionMethod({}));
    dispatch(projectBySubmissionMethod({}));
    dispatch(projectByTendererInvestor({}));
    dispatch(topTendersByProjectCount({}));
    dispatch(topTendersByProjectTotalAmount({}));
    dispatch(topInvestorsByProjectPartial({}));
    dispatch(topInvestorsByProjectFull({}));
    dispatch(topInvestorsByProjectTotalAmount({}));
    dispatchFundingSource(getListFundingSource());
    dispatchIndustry(getIndustries());
  }, []);

  useEffect(() => {
    if (selectedYear) {
      dispatch(timeJoiningWebsiteOfEnterprise({ body: { year: selectedYear } }));
      dispatch(projectsStatusPreMonth({ body: { year: selectedYear } }));
      dispatch(industryHasTheMostProject({ body: { year: selectedYear } }));
      dispatch(industryHasTheMostEnterprise({ body: { year: selectedYear } }));
    }
  }, [selectedYear, dispatch]);

  useEffect(() => {
    if (stateFundingSource.listFundingSources.length > 0 && !selectedFundingSource) {
      setSelectedFundingSource(String(stateFundingSource.listFundingSources[0].id));
    }
  }, [stateFundingSource, selectedFundingSource]);
  useEffect(() => {
    if (stateIndustry.listIndustry.length > 0 && !selectedIndustry) {
      setSelectedIndustry(String(stateIndustry.listIndustry[0].id));
    }
  }, [stateIndustry, selectedIndustry]);

  useEffect(() => {
    if (selectedFundingSource) {
      dispatch(
        topEnterprisesHaveCompletedProjectsByFundingSource({
          body: { id: +selectedFundingSource },
        }),
      );
    }
  }, [selectedFundingSource, dispatch]);

  useEffect(() => {
    if (selectedIndustry) {
      dispatch(
        topEnterprisesHaveCompletedProjectsByIndustry({
          body: { id: +selectedIndustry },
        }),
      );
    }
  }, [selectedIndustry, dispatch]);

  const handleFundingSourceChange = (value: string) => setSelectedFundingSource(value);
  const handleIndustryChange = (value: string) => setSelectedIndustry(value);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };
  const names = state.projectsStatusPreMonth?.completed?.map((item: string) => Object.keys(item)[0]) || [];

  const completedValues = state.projectsStatusPreMonth?.completed?.map((item: number) => Object.values(item)[0]);
  const approvedValues = state.projectsStatusPreMonth?.approved?.map((item: number) => Object.values(item)[0]);
  const openedBiddingValues = state.projectsStatusPreMonth?.opened_bidding?.map((item: number) => Object.values(item)[0]);

  return (
    <>
      <Heading title="Tổng quan về đấu thầu" hasBreadcrumb />
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">1. Tổng quan về thị trường đấu thầu</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={24} xl={12}>
            <h3 className="mb-4 text-lg font-semibold">Tổng giá trị trúng thầu toàn quốc</h3>
            <ul className="list-inside list-disc">
              <li>Thống kê tổng giá trị công bố trúng thầu của thị trường đấu thầu việt nam trong 12 tháng qua.</li>
              <li>Thống kê đã loại trừ các gói thầu đã công bố kết quả nhưng sau đó đã bị huỷ bỏ.</li>
            </ul>
          </Col>
          <Col xs={24} sm={24} md={24} xl={12}>
            <h3 className="mb-4 text-lg font-semibold">Tổng số gói thầu</h3>
            <p>
              Thống kê tổng số gói thầu đã được đăng tải chào thầu công khai trên
              <Link to={"https://muasamcong.mpi.gov.vn"} className="text-blue-500">
                {" "}
                https://muasamcong.mpi.gov.vn{" "}
              </Link>
              Trong số này, chúng tôi cũng đã phân loại chia theo:
            </p>
            <ul className="list-inside list-disc">
              <li>Số gói thầu đã đóng</li>
              <li>Số gói thầu đang mở thầu</li>
              <li>Số gói thầu mới đăng tải trong 24h</li>
              <li>Số gói thầu mới có cập nhật/thay đổi trạng thái trong ngày</li>
            </ul>
          </Col>
        </Row>
      </div>
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">2. Phân tích chi tiết</h2>
        <Row gutter={[24, 24]}>
          <ChartSection
            title="2.1 Dự án theo nguồn tài trợ"
            chartTitle="Dự án nguồn tài trợ"
            data={state.fundingData}
            chartType="bar"
            description={[
              "Thể hiện các dự án được tài trợ bởi các nguồn nào (ví dụ: chính phủ, tư nhân, tổ chức quốc tế)",
              "Giúp doanh nghiệp nhận diện và đánh giá sự đa dạng của các nguồn tài trợ, từ đó đưa ra chiến lược tiếp cận hoặc tìm kiếm thêm nguồn tài trợ phù hợp.",
            ]}
          />
          <ChartSection
            title="2.2 Dự án theo ngành"
            chartTitle="Dự án theo ngành"
            data={state.industryData}
            chartType="bar"
            barWidth={50}
            valueType="quantity"
            description={[
              "Biểu đồ này phân tích số lượng và tỷ lệ dự án trong từng ngành khác nhau.",
              "Giúp doanh nghiệp và nhà quản lý lập kế hoạch, ưu tiên ngành phù hợp, điều chỉnh nguồn lực và đầu tư vào các ngành đang phát triển mạnh hoặc tiềm năng.",
            ]}
          />

          <ChartSection
            title="2.3 Dự án theo phạm vi trong nước/quốc tế"
            chartTitle="Dự án theo phạm vi trong nước/quốc tế"
            data={state.domesticData}
            chartType="pie"
            description={[
              "Phân loại các dự án thành trong nước hoặc quốc tế, giúp đánh giá phạm vi và quy mô địa lý của các dự án.",
              "Hỗ trợ doanh nghiệp xác định mức độ phụ thuộc vào nguồn lực trong nước hay quốc tế, đưa ra quyết định chiến lược mở rộng và phát triển dự án.",
            ]}
          />

          <ChartSection
            title="2.4 Dự án theo phương pháp lựa chọn nhà thầu"
            chartTitle="Dự án theo phương pháp lựa chọn nhà thầu"
            data={state.selectionData}
            chartType="pie"
            description={[
              "Phân loại các dự án theo phương pháp lựa chọn nhà thầu (đấu thầu công khai, đấu thầu hạn chế)",
              "Giúp đánh giá hiệu quả, tính minh bạch của từng phương pháp, đưa ra quyết định cải thiện quy trình đấu thầu nhằm nâng cao chất lượng đấu thầu.",
            ]}
          />

          <ChartSection
            title="2.5 Dự án theo phương thức nộp thầu"
            chartTitle="Dự án theo phương thức nộp thầu"
            data={state.submissionData}
            chartType="pie"
            description={[
              "Phân tích cách thức nộp thầu của các dự án (trực tuyến, trực tiếp)",
              "Thúc đẩy cải tiến công nghệ, tối ưu hóa quy trình nộp thầu theo xu hướng số hóa, giúp tiết kiệm thời gian và chi phí.",
            ]}
          />

          <ChartSection
            title="2.6 Dự án theo nhà thầu và nhà đầu tư"
            chartTitle="Doanh nghiệp thuộc diện"
            data={state.tendererData}
            chartType="pie"
            description={[
              "Thống kê số liệu về nhà thầu và nhà đầu tư của các dự án, từ đó xác định những đối tượng tham gia chính",
              "Hỗ trợ xây dựng hồ sơ đối tác, cải thiện mối quan hệ với các nhà thầu và nhà đầu tư, giúp thu hút đầu tư và tạo cơ hội hợp tác tiềm năng cho dự án.",
            ]}
          />

          <ChartSection
            title="2.7 Dự án theo loại hình tổ chức"
            chartTitle="Dự án theo loại hình tổ chức"
            data={state.organizationData}
            chartType="bar"
            barWidth={50}
            valueType="quantity"
            description={[
              "Cho thấy các dự án được thực hiện bởi loại hình tổ chức nào (nhà nước, ngoài nhà nước)",
              "Hỗ trợ doanh nghiệp xác định các loại hình tổ chức có khả năng hợp tác cao hoặc có ưu thế triển khai dự án, từ đó xây dựng chiến lược hợp tác phù hợp.",
            ]}
          />

          <ChartSection
            title="2.8 Thời gian trung bình của dự án theo ngành"
            chartTitle="Thời gian trung bình của dự án theo ngành"
            data={state.durationData}
            chartType="pie"
            valueType="date"
            description={[
              "Biểu đồ này thể hiện thời gian trung bình hoàn thành các dự án trong từng ngành khác nhau, giúp nhận biết ngành nào có chu kỳ dự án dài hoặc ngắn hơn.",
              "Giúp doanh nghiệp lập kế hoạch hiệu quả hơn, phân bổ tài nguyên đúng cho các dự án trong ngành có thời gian ngắn hoặc dài, điều chỉnh chiến lược để đảm bảo tiến độ và tối ưu hóa nguồn lực.",
            ]}
          />
        </Row>
      </div>
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">3. Top biểu đồ</h2>
        <Row gutter={[24, 24]}>
          <ChartSection
            title="3.1 Top 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo số lượng"
            chartTitle="Top 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo số lượng"
            data={state.toptenderersbyprojectcountData}
            chartType="bar"
            barWidth={50}
            valueType="quantity"
            description={[
              "Đây là biểu đồ thể hiện 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo số lượng.",
              "Giúp doanh nghiệp nắm bắt được các đơn vị mời thầu có bao nhiêu gói thầu.",
            ]}
          />

          <ChartSection
            title="3.2 Top 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo giá"
            chartTitle="Top 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo giá"
            data={state.toptenderersbyprojecttotalamountData}
            chartType="bar"
            barWidth={50}
            valueType="currency"
            description={[
              "Đây là biểu đồ thể hiện 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo giá.",
              "Giúp doanh nghiệp có thể tạo ra các cơ hội phát triển và cải thiện vị thế cạnh tranh trong ngành của mình.",
            ]}
          />

          <ChartSection
            title="3.3 Top 10 đơn vị trúng thầu nhiều nhất theo từng phần"
            chartTitle="Top 10 đơn vị trúng thầu nhiều nhất theo từng phần"
            data={state.topinvestorsbyprojectpartialData}
            chartType="bar"
            barWidth={50}
            valueType="quantity"
            description={[
              "Đây là biểu đồ thể hiện 10 đơn vị trúng thầu nhiều nhất theo từng phần.",
              "Giúp doanh nghiệp có thể tạo ra các cơ hội phát triển và cải thiện vị thế cạnh tranh trong ngành của mình.",
            ]}
          />

          <ChartSection
            title="3.4 Top 10 đơn vị trúng thầu nhiều nhất theo trọn gói"
            chartTitle="Top 10 đơn vị trúng thầu nhiều nhất theo trọn gói"
            data={state.topinvestorsbyprojectfullData}
            chartType="bar"
            barWidth={50}
            valueType="quantity"
            description={[
              "Đây là biểu đồ thể hiện 10 đơn vị trúng thầu nhiều nhất theo gói thầu.",
              "Giúp doanh nghiệp có thể tạo ra các cơ hội phát triển và cải thiện vị thế cạnh tranh trong ngành của mình.",
            ]}
          />

          <ChartSection
            title="3.5 Top 10 đơn vị trúng thầu nhiều nhất theo trọn gói"
            chartTitle="Top 10 đơn vị trúng thầu nhiều nhất theo trọn gói"
            data={state.topinvestorsbyprojecttotalamountData}
            chartType="bar"
            barWidth={50}
            valueType="currency"
            description={[
              "Đây là biểu đồ thể hiện 10 đơn vị trúng thầu nhiều nhất theo gói thầu.",
              "Giúp doanh nghiệp có thể tạo ra các cơ hội phát triển và cải thiện vị thế cạnh tranh trong ngành của mình.",
            ]}
          />
        </Row>
      </div>
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">4. Bảng xếp hạng Doanh Nghiệp</h2>
        <Row gutter={[24, 24]}>
          <TopEnterpriseChart
            title="Top 10 doanh nghiệp đã hoàn thành dự án theo nguồn tài trợ"
            data={state.topEnterprisesHaveCompletedProjectsByFundingSource}
            selectedValue={selectedFundingSource}
            options={stateFundingSource.listFundingSources.map((fs: any) => ({ label: fs.name, value: String(fs.id) }))}
            onChange={handleFundingSourceChange}
            placeholder="Chọn nguồn tài trợ..."
          />
          <TopEnterpriseChart
            title="Top 10 doanh nghiệp đã hoàn thành dự án theo ngành"
            data={state.topEnterprisesHaveCompletedProjectsByIndustry}
            selectedValue={selectedIndustry}
            options={stateIndustry.listIndustry.map((ind: any) => ({ label: ind.name, value: String(ind.id) }))}
            onChange={handleIndustryChange}
            placeholder="Chọn ngành..."
          />
        </Row>
      </div>
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">5. Bảng xếp hạng Doanh Nghiệp theo năm</h2>
        <Select
          placeholder="Chọn năm..."
          value={selectedYear}
          onChange={handleYearChange}
          options={yearOptions.map((year) => ({ label: year, value: year }))}
          style={{ width: 150, marginBottom: 16 }}
        />
        <Row gutter={[24, 24]}>
          <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
            <GenericChart
              name={Object.keys(state.timeJoiningWebsiteOfEnterprise)}
              value={Object.values(state.timeJoiningWebsiteOfEnterprise).map(({ value }) => value)}
              chartType="line"
              seriesName="Dữ liệu theo tháng"
              title="Biểu đồ thể hiện số lượng doanh nghiệp tham gia hệ giống theo tháng trong năm"
              tooltipEnabled
              legendPosition="bottom"
            />
          </div>
          <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
            <GenericChart
              name={state.industryHasTheMostEnterprise.map(({ industry }) => industry)}
              value={state.industryHasTheMostEnterprise.map(({ total_enterprise }) => total_enterprise)}
              chartType="bar"
              title="Biểu đồ số lượng dự án phân bổ theo ngành nghề"
            />
          </div>
          <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
            <GenericChart
              name={state.industryHasTheMostProject.map(({ industry }) => industry)}
              value={state.industryHasTheMostProject.map(({ total_project }) => total_project)}
              chartType="bar"
              title="Biểu đồ số lượng doanh nghiệp phân bổ theo ngành nghề"
            />
          </div>
          <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
            <GenericChart
              name={names}
              chartType="area" // Loại biểu đồ là area
              title="Biểu đồ thể hiện số lượng dự án hoàn thành, số lượng dự án được phê duyệt , số lượng dự án mở thầu theo từng tháng"
              tooltipEnabled
              legendPosition="bottom"
              series={[
                { name: "Hoàn thành", data: completedValues },
                { name: "Phê duyệt", data: approvedValues },
                { name: "Mở thầu", data: openedBiddingValues },
              ]}
            />
          </div>
          {/* <AreaChart /> */}
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
