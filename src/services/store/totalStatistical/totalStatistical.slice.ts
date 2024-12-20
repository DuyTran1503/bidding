import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { countProjects } from "./totalStatistical.thunk";
import { ITotalStatistical } from "./totalStatistical.model";

export interface ITotalStatisticalState extends IInitialState {
  countProjects?: ITotalStatistical[];
}

const initialState: ITotalStatisticalState = {
  status: EFetchStatus.IDLE,
  countProjects: [],
  message: "",
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 50,
};

const totalStatisticalSlice = createSlice({
  name: "total_statistical",
  initialState,
  reducers: {
    ...commonStaticReducers<ITotalStatisticalState>(),
    resetStatus(state) {
      state.status = EFetchStatus.IDLE;
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(countProjects.fulfilled, (state, { payload }: PayloadAction<IResponse<ITotalStatistical[]> | any>) => {
        if (payload.data) {
          state.countProjects = payload.data;
        }
      })
      .addCase(countProjects.rejected, (state, { payload }: PayloadAction<IError[] | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});
export const { setFilter, resetStatus } = totalStatisticalSlice.actions;
export { totalStatisticalSlice };
