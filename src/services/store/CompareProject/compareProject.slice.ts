import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { compareBarChartTotalAmount } from "./compareProject.thunk";
import { ICompareProject } from "./compareProject.model";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";
import { commonStaticReducers } from "@/services/shared";

export interface ICompareProjectInitialState extends IInitialState {
  compareBarChartTotalAmount: ICompareProject[];
}

const initialState: ICompareProjectInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  compareBarChartTotalAmount: [],
  totalRecords: 0,
  filter: {
    size: 10,
    page: 1,
  },
};

const compareProjectSlice = createSlice({
  name: "compareproject",
  initialState,
  reducers: {
    ...commonStaticReducers<ICompareProjectInitialState>(),
  },
  extraReducers: (builder) => {
    builder
      .addCase(compareBarChartTotalAmount.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(compareBarChartTotalAmount.fulfilled, (state, { payload }: PayloadAction<IResponse<ICompareProject> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thêm dự án so sánh thành công";
        if (payload.data) {
          state.compareBarChartTotalAmount.push(payload.data);
        }
      })
      .addCase(compareBarChartTotalAmount.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = compareProjectSlice.actions;
export { compareProjectSlice };
