import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";

import { ICompareProject } from "./compareProject.model";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";
import { commonStaticReducers } from "@/services/shared";
import {
  compareBarChartTotalAmount,
  compareBidderCount,
  compareBidSubmissionTime,
  compareConstructionTime,
  comparePieChartTotalAmount,
} from "./compareProject.thunk";

export interface ICompareProjectInitialState extends IInitialState {
  compareBarChartTotalAmount: ICompareProject[];
  compareConstructionTime: ICompareProject[];
  compareBidSubmissionTime: ICompareProject[];
  comparePieChartTotalAmount: ICompareProject[];
  compareBidderCount: ICompareProject[];
}

const initialState: ICompareProjectInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  compareBarChartTotalAmount: [],
  compareConstructionTime: [],
  compareBidSubmissionTime: [],
  comparePieChartTotalAmount: [],
  compareBidderCount: [],
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
      // compareBarChartTotalAmount
      .addCase(compareBarChartTotalAmount.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(compareBarChartTotalAmount.fulfilled, (state, { payload }: PayloadAction<IResponse<ICompareProject> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thêm dự án so sánh thành công (Bar Chart)";
        if (payload.data) {
          state.compareBarChartTotalAmount = payload.data;
        }
      })
      .addCase(compareBarChartTotalAmount.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      })

      // compareConstructionTime
      .addCase(compareConstructionTime.fulfilled, (state, { payload }: PayloadAction<IResponse<ICompareProject> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thêm dự án so sánh thành công (Construction Time)";
        if (payload.data) {
          state.compareConstructionTime = payload.data;
        }
      })
      .addCase(compareConstructionTime.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      })

      // compareBidSubmissionTime
      .addCase(compareBidSubmissionTime.fulfilled, (state, { payload }: PayloadAction<IResponse<ICompareProject> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thêm dự án so sánh thành công (Bid Submission Time)";
        if (payload.data) {
          state.compareBidSubmissionTime = payload.data;
        }
      })
      .addCase(compareBidSubmissionTime.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      })

      // comparePieChartTotalAmount
      .addCase(comparePieChartTotalAmount.fulfilled, (state, { payload }: PayloadAction<IResponse<ICompareProject> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thêm dự án so sánh thành công (Pie Chart Total Amount)";
        if (payload.data) {
          state.comparePieChartTotalAmount = payload.data;
        }
      })
      .addCase(comparePieChartTotalAmount.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      })

      // compareBidderCount
      .addCase(compareBidderCount.fulfilled, (state, { payload }: PayloadAction<IResponse<ICompareProject> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thêm dự án so sánh thành công (Bidder Count)";
        if (payload.data) {
          state.compareBidderCount = payload.data;
        }
      })
      .addCase(compareBidderCount.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = compareProjectSlice.actions;
export { compareProjectSlice };
