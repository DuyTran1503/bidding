// chart.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IChartEnterprise } from "./enterprise_chart.model";
import { getSalaryOfEmployees } from "./enterprise_chart.thunk";

export interface IChartEnterpriseInitialState extends IInitialState {
  salaryOfEmployees: IChartEnterprise[]; // Dữ liệu biểu đồ theo ngành
}

const initialState: IChartEnterpriseInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  salaryOfEmployees: [],
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
    builder.addCase(getSalaryOfEmployees.fulfilled, (state, { payload }: PayloadAction<IResponse<IChartEnterprise[]>>) => {
      state.salaryOfEmployees = payload.data;
      state.status = EFetchStatus.FULFILLED;
    });
    builder.addCase(getSalaryOfEmployees.rejected, (state, action) => {
      state.status = EFetchStatus.REJECTED;
      state.message = (action.payload as string) || "Có lỗi xảy ra khi tải dữ liệu";
    });
  },
});

export { chartEnterpriseSlice };
