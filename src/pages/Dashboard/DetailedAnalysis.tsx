/* eslint-disable max-len */
import React, { useEffect } from "react";
import { Row } from "antd";
import ChartSection from "@/components/chart/ChartSection";
import { useArchive } from "@/hooks/useArchive";
import { 
    projectByIndustry, 
    projectByFundingsource, 
    projectByDomestic, 
    averageProjectPurationByIndustry, 
    projectByOrganizationType, 
    projectBySelectionMethod, 
    projectBySubmissionMethod, 
    projectByTendererInvestor 
} from "@/services/store/chart/chart.thunk";
import { IChartInitialState } from "@/services/store/chart/chart.slice";

const DetailedAnalysis: React.FC = () => {
  const { state, dispatch } = useArchive<IChartInitialState>("chart");

  useEffect(() => {
    dispatch(projectByIndustry({})),
    dispatch(projectByFundingsource({})),
    dispatch(averageProjectPurationByIndustry({})),
    dispatch(projectByDomestic({})),
    dispatch(projectByOrganizationType({})),
    dispatch(projectBySelectionMethod({})),
    dispatch(projectBySubmissionMethod({})),
    dispatch(projectByTendererInvestor({}))
  }, []);
  return (
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
  );
};

export default DetailedAnalysis;
