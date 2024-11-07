import { commonStaticReducers } from "@/services/shared";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IInitialState } from "@/shared/utils/shared-interfaces";
import { createSlice } from "@reduxjs/toolkit";
import { IAvgDifficultyOfTheTaskEnterprise } from "./avgDifficultyOfTheTask.model";
import { avgDifficultyByEnterprise } from "./avgDifficultyOfTheTask.thunk";
export interface IAvgDifficultyOfTheTaskEnterpriseInitialState extends IInitialState {
  avgDifficultyByEnterprise: IAvgDifficultyOfTheTaskEnterprise[];
}

const initialState: IAvgDifficultyOfTheTaskEnterpriseInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  avgDifficultyByEnterprise: [],
  totalRecords: 0,
  filter: {
    size: 10,
    page: 1,
  },
};

const avgDifficultyByEnterpriseSlice = createSlice({
  name: "avgDifficultyByEnterprise",
  initialState,
  reducers: {
    ...commonStaticReducers<IAvgDifficultyOfTheTaskEnterpriseInitialState>(),
  },
  extraReducers: (builder) => {
    const pendingReducer = (state: IAvgDifficultyOfTheTaskEnterpriseInitialState) => {
      state.status = EFetchStatus.PENDING;
    };

    const fulfilledReducer = (
      state: IAvgDifficultyOfTheTaskEnterpriseInitialState,
      payload: any,
      message: string,
      key: keyof IAvgDifficultyOfTheTaskEnterpriseInitialState,
    ) => {
      state.status = EFetchStatus.FULFILLED;
      state.message = message;
      if (payload) {
        state[key] = payload;
      }
    };

    const rejectedReducer = (state: IAvgDifficultyOfTheTaskEnterpriseInitialState, payload: any) => {
      state.status = EFetchStatus.REJECTED;
      state.message = transformPayloadErrors(payload?.errors);
    };

    builder

      // compareConstructionTime
      .addCase(avgDifficultyByEnterprise.pending, pendingReducer)
      .addCase(avgDifficultyByEnterprise.fulfilled, (state, { payload }) =>
        fulfilledReducer(state, payload, "Thêm thông số so sánh thành công (Construction Time)", "avgDifficultyByEnterprise"),
      )
      .addCase(avgDifficultyByEnterprise.rejected, (state, { payload }) => rejectedReducer(state, payload));
  },
});

export const { resetStatus, setFilter } = avgDifficultyByEnterpriseSlice.actions;
export { avgDifficultyByEnterpriseSlice };
