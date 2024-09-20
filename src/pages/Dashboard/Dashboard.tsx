import React from "react";
import Heading from "@/components/layout/Heading";
import AreaChart from "@/components/chart/AreaChart";
import RadarChart from "@/components/chart/RadarChart";
import PieChart from "@/components/chart/PieChart";
import BarChart from "@/components/chart/BarChart";
import LineChart from "@/components/chart/LineChart";
import Histogram from "@/components/chart/HistogramChart";
import ScatterPlot from "@/components/chart/ScatterPlot";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Heading title="Dashboard" hasBreadcrumb />
      <AreaChart />
      <RadarChart />
      <PieChart />
      <BarChart />
      <LineChart />
      <Histogram />
      <ScatterPlot />
    </div>
  );
};

export default Dashboard;
