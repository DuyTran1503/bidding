import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import { IStaff } from "./account.model";
import { getAllStaff } from "./account.thunk";

export interface IAccountInitialState extends IInitialState {
  staffs: IStaff[];
}

const initialState: IAccountInitialState = {
  status: EFetchStatus.IDLE,
  staffs: [],
  message: "",
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 50,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    ...commonStaticReducers<IAccountInitialState>(),
  },

  extraReducers(builder) {
    builder.addCase(getAllStaff.fulfilled, (state, { payload }: PayloadAction<IResponse<IStaff[]> | any>) => {
      if (payload.data) {
        state.staffs = payload.data.data;
      }
    });
  },
});
export const { setFilter } = accountSlice.actions;
export { accountSlice };
