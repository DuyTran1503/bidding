<<<<<<< HEAD
// // chart.slice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
// import { EFetchStatus } from "@/shared/enums/fetchStatus";
// import { IChartEnterprise } from "./enterprise_chart.model";
// import { getSalaryOfEmployees } from "./enterprise_chart.thunk";

// export interface IChartEnterpriseInitialState extends IInitialState {
//   salaryOfEmployees: IChartEnterprise[]; // Dữ liệu biểu đồ theo ngành
// }

// const initialState: IChartEnterpriseInitialState = {
//   status: EFetchStatus.IDLE,
//   message: "",
//   salaryOfEmployees: [],
//   totalRecords: 0,
//   filter: {
//     size: 10,
//     page: 1,
//   },
// };

// const chartEnterpriseSlice = createSlice({
//   name: "chart_enterprise",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(getSalaryOfEmployees.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
//       state.salaryOfEmployees = payload.data;
//       state.status = EFetchStatus.FULFILLED;
//     });
//     builder.addCase(getSalaryOfEmployees.rejected, (state, action) => {
//       state.status = EFetchStatus.REJECTED;
//       state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
//     });
//   },
// });

// export { chartEnterpriseSlice };
=======
// chart.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IBiddingStatistic, IChartEnterprise, INumberOfEmployeeEnterprise, IResultBiddingStatistic } from "./enterprise_chart.model";
import {
  getAverageDifficultyLevelTasks,
  getEmployeeQuantityStatistic,
  getEmployeeResultBiddingStatistic,
  getSalaryOfEmployees,
} from "./enterprise_chart.thunk";

export interface IChartEnterpriseInitialState extends IInitialState {
  salaryOfEmployees: IChartEnterprise[]; // Dữ liệu biểu đồ theo ngành
  employeeResultBiddingStatistic: IResultBiddingStatistic[];
  projectStatistic: IBiddingStatistic[];
  averageDifficultyLevelTask: IBiddingStatistic[];
  numberOfEmployeeEnterprise: INumberOfEmployeeEnterprise[];
}

const initialState: IChartEnterpriseInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  salaryOfEmployees: [],
  employeeResultBiddingStatistic: [],
  projectStatistic: [],
  averageDifficultyLevelTask: [],
  numberOfEmployeeEnterprise: [],
  totalRecords: 0,
  filter: {
    size: 10,
    page: 1,
  },
};

const chartEnterpriseSlice = createSlice({
  name: "chart_enterprise",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSalaryOfEmployees.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.salaryOfEmployees = payload.data;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(getSalaryOfEmployees.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    });
    builder.addCase(getEmployeeResultBiddingStatistic.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.employeeResultBiddingStatistic = payload.data;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(getEmployeeResultBiddingStatistic.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    });
    builder.addCase(getAverageDifficultyLevelTasks.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.averageDifficultyLevelTask = payload.data;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(getAverageDifficultyLevelTasks.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    });
    builder.addCase(getEmployeeQuantityStatistic.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.numberOfEmployeeEnterprise = payload.data;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(getEmployeeQuantityStatistic.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    });
  },
});

export { chartEnterpriseSlice };
>>>>>>> c9843c114bb21f52324f28d188c3ec3bcb431663
