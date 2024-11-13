import React, { useEffect, useState } from "react";
import { message, Row } from "antd";
import TopEnterpriseChart from "./TopEnterpriseChart";
import { useArchive } from "@/hooks/useArchive";
import { getListFundingSource } from "@/services/store/funding_source/funding_source.thunk";
import { getIndustries } from "@/services/store/industry/industry.thunk";
import { IChartInitialState } from "@/services/store/chart/chart.slice";
import { IFundingSourceInitialState } from "@/services/store/funding_source/funding_source.slice";
import { IIndustryInitialState } from "@/services/store/industry/industry.slice";
import { topEnterprisesHaveCompletedProjectsByFundingSource, topEnterprisesHaveCompletedProjectsByIndustry } from "@/services/store/chart/chart.thunk";

const EnterpriseRanking: React.FC = () => {
  const { state, dispatch } = useArchive<IChartInitialState>("chart");
  const { state: stateFundingSource, dispatch: dispatchFundingSource } = useArchive<IFundingSourceInitialState>("funding_source");
  const { state: stateIndustry, dispatch: dispatchIndustry } = useArchive<IIndustryInitialState>("industry");
  const [selectedFundingSource, setSelectedFundingSource] = useState<string>();
  const [selectedIndustry, setSelectedIndustry] = useState<string>();

  useEffect(() => {
    dispatchFundingSource(getListFundingSource());
    dispatchIndustry(getIndustries());
  }, []);

  useEffect(() => {
    if (stateFundingSource.listFundingSources.length > 0 && !selectedFundingSource) {
      setSelectedFundingSource(String(stateFundingSource.listFundingSources[0].id));
    }
  }, []);

  useEffect(() => {
    if (stateIndustry.listIndustry.length > 0 && !selectedIndustry) {
      setSelectedIndustry(String(stateIndustry.listIndustry[0].id));
    }
  }, []);

  useEffect(() => {
    if (selectedFundingSource) {
      dispatch(
        topEnterprisesHaveCompletedProjectsByFundingSource({
          body: { id: +selectedFundingSource },
        }),
      );
    }
  }, []);
  useEffect(() => {
    if (selectedIndustry) {
      dispatch(
        topEnterprisesHaveCompletedProjectsByIndustry({
          body: { id: +selectedIndustry },
        }),
      );
    }
  }, [selectedIndustry, dispatch]);

  const handleFundingSourceChange = (value: string) => {
    message.loading("Đang tải dữ liệu");
    setSelectedFundingSource(value);
  }
  const handleIndustryChange = (value: string) => {
    message.loading("Đang tải dữ liệu");
    setSelectedIndustry(value);
  }
  return (
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
  );
};

export default EnterpriseRanking;
