import React, { useEffect } from "react";
import { Row } from "antd";
import ChartSection from "@/components/chart/ChartSection";
import { useArchive } from "@/hooks/useArchive";
import { 
    topInvestorsByProjectFull, 
    topInvestorsByProjectPartial, 
    topInvestorsByProjectTotalAmount, 
    topTendersByProjectCount, 
    topTendersByProjectTotalAmount 
} from "@/services/store/chart/chart.thunk";
import { IChartInitialState } from "@/services/store/chart/chart.slice";

const TopCharts: React.FC = () => {
  const { state, dispatch } = useArchive<IChartInitialState>("chart");

  useEffect(() => {
    dispatch(topTendersByProjectCount({})),
    dispatch(topTendersByProjectTotalAmount({})),
    dispatch(topInvestorsByProjectPartial({})),
    dispatch(topInvestorsByProjectFull({})),
    dispatch(topInvestorsByProjectTotalAmount({}))
  }, []);

  return (
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
  );
};

export default TopCharts;
