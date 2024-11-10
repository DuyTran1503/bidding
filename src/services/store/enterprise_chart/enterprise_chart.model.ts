export interface IChartEnterprise {
  enterprise: string;
  salaryAvg: number;
}
export interface IResultBiddingStatistic {
  enterprise: string;
  numberProjectWinning: number;
  averageWinningAmount: number;
  totalWinningAmount: number;
}

export interface IBiddingStatistic {
  enterprise: string;
  tendererProjectCount: number;
  investorProjectCount: number;
}
