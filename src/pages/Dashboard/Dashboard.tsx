// Dashboard.tsx
import React, { useEffect } from "react";
import { useArchive } from "@/hooks/useArchive";
import { IChartInitialState } from "@/services/store/chart/chart.slice";
import {
  averageProjectPurationByIndustry,
  projectByDomestic,
  projectByFundingsource,
  projectByIndustry,
  projectByOrganizationType,
  projectBySelectionMethod,
  projectBySubmissionMethod,
  projectByTendererInvestor,
  topInvestorsByProjectFull,
  topInvestorsByProjectPartial,
  topInvestorsByProjectTotalAmount,
  topTendersByProjectCount,
  topTendersByProjectTotalAmount
} from "@/services/store/chart/chart.thunk";
import AreaChart from "@/components/chart/AreaChart";
import LineChart from "@/components/chart/LineChart";
import RadarChart from "@/components/chart/RadarChart";
import Histogram from "@/components/chart/HistogramChart";
import ScatterPlot from "@/components/chart/ScatterPlot";
import PieChart from "@/components/chart/PieChart";
import GenericChart from "@/components/chart/GenericChart";
import Heading from "@/components/layout/Heading";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { state, dispatch } = useArchive<IChartInitialState>("chart");

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
  }, [dispatch]);

  return (
    <>
      <Heading title="Tổng quan về đấu thầu" hasBreadcrumb />
      <div className="w-full ">
        <h2 className="text-xl font-semibold mb-4">1. Tổng quan về thị trường đấu thầu</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">Tổng giá trị trúng thầu toàn quốc</h3>
            <ul className="list-disc list-inside">
              <li>Thống kê tổng giá trị công bố trúng thầu của thị trường đấu thầu việt nam trong 12 tháng qua.</li>
              <li>Thống kê đã loại trừ các gói thầu đã công bố kết quả nhưng sau đó đã bị huỷ bỏ.</li>
            </ul>
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">Tổng số gói thầu</h3>
            <p>Thống kê tổng số gói thầu đã được đăng tải chào thầu công khai trên
              <Link to={"https://muasamcong.mpi.gov.vn"} className="text-blue-500"> https://muasamcong.mpi.gov.vn </Link>
              Trong số này, chúng tôi cũng đã phân loại chia theo:</p>
            <ul className="list-disc list-inside">
              <li>Số gói thầu đã đóng</li>
              <li>Số gói thầu đang mở thầu</li>
              <li>Số gói thầu mới đăng tải trong 24h</li>
              <li>Số gói thầu mới có cập nhật/thay đổi trạng thái trong ngày</li>
            </ul>

          </Col>
        </Row>
      </div>
      <div className="w-full ">
        <h2 className="text-xl font-semibold mb-4">2. Phân tích chi tiết</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">2.1 Dự án theo nguồn tài trợ</h3>
            <GenericChart
              chartType="pie"
              title="Dự án theo nguồn tài trợ"
              name={state.fundingData.map(({ name }) => name)}
              value={state.fundingData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
            // isCurrency={true}
            />
            <ul className="list-disc list-inside">
              <li>Thể hiện các dự án được tài trợ bởi các nguồn nào (ví dụ: chính phủ, tư nhân, tổ chức quốc tế)</li>
              <li>Giúp doanh nghiệp nhận diện và đánh giá sự đa dạng của các nguồn tài trợ, từ đó đưa ra chiến lược tiếp cận hoặc tìm kiếm thêm nguồn tài trợ phù hợp.</li>
            </ul>
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">2.2 Dự án theo ngành</h3>
            <GenericChart
              chartType="bar"
              title="Dự án theo ngành"
              name={state.industryData.map(({ name }) => name)}
              value={state.industryData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
              barWidth={50}
              valueType="quantity"
            />
            <ul className="list-disc list-inside">
              <li>Biểu đồ này phân tích số lượng và tỷ lệ dự án trong từng ngành khác nhau.</li>
              <li>Giúp doanh nghiệp và nhà quản lý lập kế hoạch, ưu tiên ngành phù hợp, điều chỉnh nguồn lực và đầu tư vào các ngành đang phát triển mạnh hoặc tiềm năng.</li>
            </ul>
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">2.3 Dự án theo phạm vi trong nước/quốc tế</h3>
            <ul className="list-disc list-inside">
              <li>Phân loại các dự án thành trong nước hoặc quốc tế, giúp đánh giá phạm vi và quy mô địa lý của các dự án.</li>
              <li>Hỗ trợ doanh nghiệp xác định mức độ phụ thuộc vào nguồn lực trong nước hay quốc tế, đưa ra quyết định chiến lược mở rộng và phát triển dự án.              </li>
            </ul>
            <GenericChart
              chartType="pie"
              title="Dự án theo phạm vi trong nước/quốc tế"
              name={state.domesticData.map(({ name }) => name)}
              value={state.domesticData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">2.4 Dự án theo phương pháp lựa chọn nhà thầu</h3>
            <ul className="list-disc list-inside">
              <li>Phân loại các dự án theo phương pháp lựa chọn nhà thầu (đấu thầu công khai, đấu thầu hạn chế)</li>
              <li>Giúp đánh giá hiệu quả, tính minh bạch của từng phương pháp, đưa ra quyết định cải thiện quy trình đấu thầu nhằm nâng cao chất lượng đấu thầu.              </li>
            </ul>
            <GenericChart
              chartType="pie"
              title="Dự án theo phương pháp lựa chọn nhà thầu"
              name={state.selectionData.map(({ name }) => name)}
              value={state.selectionData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">2.5 Dự án theo phương thức nộp thầu</h3>
            <ul className="list-disc list-inside">
              <li>Phân tích cách thức nộp thầu của các dự án (trực tuyến, trực tiếp)</li>
              <li>Thúc đẩy cải tiến công nghệ, tối ưu hóa quy trình nộp thầu theo xu hướng số hóa, giúp tiết kiệm thời gian và chi phí.</li>
            </ul>
            <GenericChart
              chartType="pie"
              title="Dự án theo phương thức nộp thầu"
              name={state.submissionData.map(({ name }) => name)}
              value={state.submissionData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">2.6 Dự án theo nhà thầu và nhà đầu tư</h3>
            <ul className="list-disc list-inside">
              <li>Thống kê số liệu về nhà thầu và nhà đầu tư của các dự án, từ đó xác định những đối tượng tham gia chính</li>
              <li>Hỗ trợ xây dựng hồ sơ đối tác, cải thiện mối quan hệ với các nhà thầu và nhà đầu tư, giúp thu hút đầu tư và tạo cơ hội hợp tác tiềm năng cho dự án.</li>
            </ul>
            <GenericChart
              chartType="pie"
              title="Doanh nghiệp thuộc diện"
              name={state.tendererData.map(({ name }) => name)}
              value={state.tendererData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">2.7 Dự án theo loại hình tổ chức</h3>
            <ul className="list-disc list-inside">
              <li>Cho thấy các dự án được thực hiện bởi loại hình tổ chức nào (nhà nước, ngoài nhà nước)</li>
              <li>Hỗ trợ doanh nghiệp xác định các loại hình tổ chức có khả năng hợp tác cao hoặc có ưu thế triển khai dự án, từ đó xây dựng chiến lược hợp tác phù hợp.</li>
            </ul>
            <GenericChart
              chartType="bar"
              title="Dự án theo loại hình tổ chức"
              name={state.organizationData.map(({ name }) => name)}
              value={state.organizationData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
              barWidth={50}
              valueType="quantity"
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">2.8 Thời gian trung bình của dự án theo ngành</h3>
            <ul className="list-disc list-inside">
              <li>Biểu đồ này thể hiện thời gian trung bình hoàn thành các dự án trong từng ngành khác nhau, giúp nhận biết ngành nào có chu kỳ dự án dài hoặc ngắn hơn.</li>
              <li>
                Giúp doanh nghiệp lập kế hoạch hiệu quả hơn,
                phân bổ tài nguyên đúng cho các dự án trong ngành có thời gian ngắn hoặc dài,
                điều chỉnh chiến lược để đảm bảo tiến độ và tối ưu hóa nguồn lực.
              </li>
            </ul>
            <GenericChart
              chartType="pie"
              title="Thời gian trung bình của dự án theo ngành"
              name={state.durationData.map(({ name }) => name)}
              value={state.durationData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
              barWidth={50}
              valueType="date"
            />
          </Col>
        </Row>
      </div>
      <div className="w-full ">
        <h2 className="text-xl font-semibold mb-4">3. Top biểu đồ</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">3.1 Top 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo số lượng</h3>
            <ul className="list-disc list-inside">
              <li>Đây là biểu đồ thể hiện 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo số lượng.</li>
              <li>
                Giúp doanh nghiệp nắm bắt được các đơn vị mời thầu có bao nhiêu gói thầu
              </li>
            </ul>
            <GenericChart
              chartType="bar"
              title="Top 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo số lượng"
              name={state.toptenderersbyprojectcountData.map(({ name }) => name)}
              value={state.toptenderersbyprojectcountData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
              barWidth={50}
              valueType="quantity"
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">3.2 Top 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo giá</h3>
            <ul className="list-disc list-inside">
              <li>Đây là biểu đồ thể hiện 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo theo giá.</li>
              <li>
                Giúp doanh nghiệp có thể tạo ra các cơ hội phát triển và cải thiện vị thế cạnh tranh trong ngành của mình.
              </li>
            </ul>
            <GenericChart
              chartType="bar"
              title="Top 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo giá"
              name={state.toptenderersbyprojecttotalamountData.map(({ name }) => name)}
              value={state.toptenderersbyprojecttotalamountData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
              barWidth={50}
              valueType="currency"
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">3.2 Top 10 đơn vị trúng thầu nhiều nhất theo từng phần</h3>
            <ul className="list-disc list-inside">
              <li>Đây là biểu đồ thể hiện 10 đơn vị mời thầu có tổng gói thầu nhiều nhất theo theo giá.</li>
              <li>
                Giúp doanh nghiệp có thể tạo ra các cơ hội phát triển và cải thiện vị thế cạnh tranh trong ngành của mình.
              </li>
            </ul>
            <GenericChart
              chartType="bar"
              title="Top 10 đơn vị trúng thầu nhiều nhất theo từng phần"
              name={state.topinvestorsbyprojectpartialData.map(({ name }) => name)}
              value={state.topinvestorsbyprojectpartialData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
              barWidth={50}
              valueType="quantity"
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">3.2 Top 10 đơn vị trúng thầu nhiều nhất theo trọn gói</h3>
            <ul className="list-disc list-inside">
              <li>Đây là biểu đồ thể hiện 10 đơn vị trúng thầu nhiều nhất theo gói thầu.</li>
              <li>
                Giúp doanh nghiệp có thể tạo ra các cơ hội phát triển và cải thiện vị thế cạnh tranh trong ngành của mình.
              </li>
            </ul>
            <GenericChart
              chartType="bar"
              title="Top 10 đơn vị trúng thầu nhiều nhất theo trọn gói"
              name={state.topinvestorsbyprojectfullData.map(({ name }) => name)}
              value={state.topinvestorsbyprojectfullData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
              barWidth={50}
              valueType="quantity"
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={12}>
            <h3 className="text-lg font-semibold mb-4">3.2 Top 10 đơn vị trúng thầu nhiều nhất theo trọn gói</h3>
            <ul className="list-disc list-inside">
              <li>Đây là biểu đồ thể hiện 10 đơn vị trúng thầu nhiều nhất theo gói thầu.</li>
              <li>
                Giúp doanh nghiệp có thể tạo ra các cơ hội phát triển và cải thiện vị thế cạnh tranh trong ngành của mình.
              </li>
            </ul>
            <GenericChart
              chartType="bar"
              title="Top 10 đơn vị trúng thầu nhiều nhất theo trọn gói"
              name={state.topinvestorsbyprojecttotalamountData.map(({ name }) => name)}
              value={state.topinvestorsbyprojecttotalamountData.map(({ value }) => value)}
              seriesName="Dữ liệu Biểu đồ"
              barWidth={50}
              valueType="currency"
            />
          </Col>
        </Row>
      </div>
      <AreaChart />
      <RadarChart />
      <PieChart />
      <LineChart />
      <Histogram />
      <ScatterPlot />
    </>
  );
};

export default Dashboard;
