import React, { useEffect } from "react";
import { Card } from "antd";
import StatisticalCard from "./StatisticalCard";
import { useArchive } from "@/hooks/useArchive";
import { ITotalStatisticalState } from "@/services/store/totalStatistical/totalStatistical.slice";
import { countProjects } from "@/services/store/totalStatistical/totalStatistical.thunk";

const SystemSynthesis: React.FC = () => {
  const { state, dispatch } = useArchive<ITotalStatisticalState>("total_statistical");

  useEffect(() => {
    dispatch(countProjects());
  }, [dispatch]); // Thêm dispatch vào dependencies

  return (
    <Card title="Tổng quan" bordered={true}>
      <StatisticalCard data={state.countProjects as any} />
    </Card>
  );
};

export default SystemSynthesis;
