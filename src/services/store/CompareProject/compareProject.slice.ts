import { createSlice } from '@reduxjs/toolkit';
import { IInitialState } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";

import { ICompareProject } from './compareProject.model';
import { transformPayloadErrors } from '@/shared/utils/common/function';
import { commonStaticReducers } from '@/services/shared';
import { compareBarChartTotalAmount, compareBidderCount, compareBidSubmissionTime, compareConstructionTime, comparePieChartTotalAmount } from './compareProject.thunk';

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
    const pendingReducer = (state: ICompareProjectInitialState) => {
      state.status = EFetchStatus.PENDING;
    };

    const fulfilledReducer = (state: ICompareProjectInitialState, payload: any, message: string, key: keyof ICompareProjectInitialState) => {
      state.status = EFetchStatus.FULFILLED;
      state.message = message;
      if (payload) {
        state[key] = payload;
      }
    };

    const rejectedReducer = (state: ICompareProjectInitialState, payload: any) => {
      state.status = EFetchStatus.REJECTED;
      state.message = transformPayloadErrors(payload?.errors);
    };

    builder
      // compareBarChartTotalAmount
      .addCase(compareBarChartTotalAmount.pending, pendingReducer)
      .addCase(compareBarChartTotalAmount.fulfilled, (state, { payload }) => 
        fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Bar Chart)", 'compareBarChartTotalAmount'))
      .addCase(compareBarChartTotalAmount.rejected, (state, { payload }) => rejectedReducer(state, payload))

      // compareConstructionTime
      .addCase(compareConstructionTime.pending, pendingReducer)
      .addCase(compareConstructionTime.fulfilled, (state, { payload }) => 
        fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Construction Time)", 'compareConstructionTime'))
      .addCase(compareConstructionTime.rejected, (state, { payload }) => rejectedReducer(state, payload))

      // compareBidSubmissionTime
      .addCase(compareBidSubmissionTime.pending, pendingReducer)
      .addCase(compareBidSubmissionTime.fulfilled, (state, { payload }) => 
        fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Bid Submission Time)", 'compareBidSubmissionTime'))
      .addCase(compareBidSubmissionTime.rejected, (state, { payload }) => rejectedReducer(state, payload))

      // comparePieChartTotalAmount
      .addCase(comparePieChartTotalAmount.pending, pendingReducer)
      .addCase(comparePieChartTotalAmount.fulfilled, (state, { payload }) => 
        fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Pie Chart Total Amount)", 'comparePieChartTotalAmount'))
      .addCase(comparePieChartTotalAmount.rejected, (state, { payload }) => rejectedReducer(state, payload))

      // compareBidderCount
      .addCase(compareBidderCount.pending, pendingReducer)
      .addCase(compareBidderCount.fulfilled, (state, { payload }) => 
        fulfilledReducer(state, payload, "Thêm dự án so sánh thành công (Bidder Count)", 'compareBidderCount'))
      .addCase(compareBidderCount.rejected, (state, { payload }) => rejectedReducer(state, payload));
  },
});

export const { resetStatus, setFilter } = compareProjectSlice.actions;
export { compareProjectSlice };
