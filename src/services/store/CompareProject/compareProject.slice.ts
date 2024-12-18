import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { ICompareProject, IDifficultyOfProject } from "./compareProject.model";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { commonStaticReducers } from "@/services/shared";
import {
  compareBarChartTotalAmount,
  compareBidderCount,
  compareBidSubmissionTime,
  compareConstructionTime,
  comparePieChartTotalAmount,
  detailProjectByIds,
  getDifficultyOfProject,
} from "./compareProject.thunk";

// Define thunk actions map for cleaner code
const thunkActions = {
  compareBarChartTotalAmount: {
    action: compareBarChartTotalAmount,
    key: 'compareBarChartTotalAmount' as const,
    message: "Thêm dự án so sánh thành công (Bar Chart Total Amount)"
  },
  compareConstructionTime: {
    action: compareConstructionTime,
    key: 'compareConstructionTime' as const,
    message: "Thêm dự án so sánh thành công (Construction Time)"
  },
  compareBidSubmissionTime: {
    action: compareBidSubmissionTime,
    key: 'compareBidSubmissionTime' as const,
    message: "Thêm dự án so sánh thành công (Bid Submission Time)"
  },
  comparePieChartTotalAmount: {
    action: comparePieChartTotalAmount,
    key: 'comparePieChartTotalAmount' as const,
    message: "Thêm dự án so sánh thành công (Pie Chart Total Amount)"
  },
  compareBidderCount: {
    action: compareBidderCount,
    key: 'compareBidderCount' as const,
    message: "Thêm dự án so sánh thành công (Bidder Count)"
  },
  detailProjectByIds: {
    action: detailProjectByIds,
    key: 'detailProjectByIds' as const,
    message: "Thêm dự án so sánh thành công (Project Details)"
  },
  getDifficultyOfProject: {
    action: getDifficultyOfProject,
    key: 'getDifficultyOfProject' as const,
    message: "Thêm dự án so sánh thành công (Project Details)"
  },
};

export interface ICompareProjectInitialState extends IInitialState {
  compareBarChartTotalAmount: ICompareProject[];
  compareConstructionTime: ICompareProject[];
  compareBidSubmissionTime: ICompareProject[];
  comparePieChartTotalAmount: ICompareProject[];
  compareBidderCount: ICompareProject[];
  detailProjectByIds: ICompareProject[];
  getDifficultyOfProject: IDifficultyOfProject[];
}

const initialState: ICompareProjectInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  compareBarChartTotalAmount: [],
  compareConstructionTime: [],
  compareBidSubmissionTime: [],
  comparePieChartTotalAmount: [],
  compareBidderCount: [],
  detailProjectByIds: [],
  getDifficultyOfProject: [],
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
      state.loading = true;
    };

    const fulfilledReducer = (
      state: ICompareProjectInitialState,
      payload: any,
      message: string,
      key: keyof ICompareProjectInitialState
    ) => {
      state.status = EFetchStatus.FULFILLED;
      state.message = message;
      if (payload) {
        state[key] = payload;
      }
      state.loading = false;
    };

    const rejectedReducer = (state: ICompareProjectInitialState, payload: any) => {
      state.status = EFetchStatus.REJECTED;
      state.message = transformPayloadErrors(payload?.errors);
      state.loading = false;
    };

    // Dynamically add cases for all thunk actions
    Object.values(thunkActions).forEach(({ action, key, message }) => {
      builder
        .addCase(action.pending, pendingReducer)
        .addCase(action.fulfilled, (state, { payload }) =>
          fulfilledReducer(state, payload, message, key))
        .addCase(action.rejected, (state, { payload }) =>
          rejectedReducer(state, payload));
    });
  },
});

export const { resetStatus, setFilter } = compareProjectSlice.actions;
export { compareProjectSlice };