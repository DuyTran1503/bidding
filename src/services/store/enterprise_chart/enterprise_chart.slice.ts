// chart.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IChartEnterprise } from "./enterprise_chart.model";
import {
  getEmployeeProjectStatistic,
  getEmployeeQuantityStatistic,
  getEmployeeResultBiddingStatistic,
  getSalaryOfEmployees,
  detailEnterpriseByIds,
  averageDifficultyLevelTasksByEnterprise,
  averageDifficultyLevelTasksByEmployee,
  averageFeedbackByEmployee,
  projectCompletedByEnterprise,
  projectWonByEnterprise
} from "./enterprise_chart.thunk";

export interface IChartEnterpriseInitialState extends IInitialState {
  salaryOfEmployees: IChartEnterprise[]; // Dữ liệu biểu đồ theo ngành
  employeeResultBiddingStatistic: IChartEnterprise[];
  projectStatistic: IChartEnterprise[];
  averageDifficultyLevelTask: IChartEnterprise[];
  numberOfEmployeeEnterprise: IChartEnterprise[];
  getEmployeeProjectStatistic: IChartEnterprise[];
  detailEnterpriseByIds: IChartEnterprise[];
  averageDifficultyLevelTasksByEnterprise: IChartEnterprise[];
  averageDifficultyLevelTasksByEmployee: IChartEnterprise[];
  averageFeedbackByEmployee: IChartEnterprise[];
  projectCompletedByEnterprise: IChartEnterprise[];
  projectWonByEnterprise: IChartEnterprise[];
}

const initialState: IChartEnterpriseInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  salaryOfEmployees: [],
  employeeResultBiddingStatistic: [],
  projectStatistic: [],
  averageDifficultyLevelTask: [],
  numberOfEmployeeEnterprise: [],
  getEmployeeProjectStatistic: [],
  detailEnterpriseByIds: [],
  averageDifficultyLevelTasksByEnterprise: [],
  averageDifficultyLevelTasksByEmployee: [],
  averageFeedbackByEmployee: [],
  projectCompletedByEnterprise: [],
  projectWonByEnterprise: [],
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
    builder
    // SalaryOfEmployees
    .addCase(getSalaryOfEmployees.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.salaryOfEmployees = payload.data;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(getSalaryOfEmployees.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    })
    // EmployeeResultBiddingStatistic
    .addCase(getEmployeeResultBiddingStatistic.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.employeeResultBiddingStatistic = payload.data;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(getEmployeeResultBiddingStatistic.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    })
    // EmployeeQuantityStatistic
    .addCase(getEmployeeQuantityStatistic.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.numberOfEmployeeEnterprise = payload.data;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(getEmployeeQuantityStatistic.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    })
    // employee-project-statistic-by-enterprise
    .addCase(getEmployeeProjectStatistic.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.getEmployeeProjectStatistic = payload.data;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(getEmployeeProjectStatistic.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    })
    // average-difficulty-level-tasks-by-enterprise
    .addCase(averageDifficultyLevelTasksByEnterprise.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.averageDifficultyLevelTasksByEnterprise = payload.data;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(averageDifficultyLevelTasksByEnterprise.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    })
    // average-difficulty-level-tasks-by-employee
    .addCase(averageDifficultyLevelTasksByEmployee.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.averageDifficultyLevelTasksByEmployee = payload.data;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(averageDifficultyLevelTasksByEmployee.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    })
    // average-feedback-by-employee
    .addCase(averageFeedbackByEmployee.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.averageFeedbackByEmployee = payload.data;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(averageFeedbackByEmployee.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    })
    // project-completed-by-enterprise
    .addCase(projectCompletedByEnterprise.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.projectCompletedByEnterprise = payload.data;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(projectCompletedByEnterprise.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    })
    // project-won-by-enterprise
    .addCase(projectWonByEnterprise.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.projectWonByEnterprise = payload.data;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(projectWonByEnterprise.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    })
    // detail-enterprise-by-ids
    .addCase(detailEnterpriseByIds.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]> | any>) => {
      state.detailEnterpriseByIds = payload.data;
      state.status = EFetchStatus.FULFILLED;
    })
    .addCase(detailEnterpriseByIds.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    })
  },
});

export { chartEnterpriseSlice };
