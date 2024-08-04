import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import { IStaff } from "./account.model";
import { getAllStaff, getStaffById } from "./account.thunk";

export interface IAccountInitialState extends IInitialState {
  staffs: IStaff[];
  staff?: IStaff | any;
}

const initialState: IAccountInitialState = {
  status: EFetchStatus.IDLE,
  staffs: [],
  staff: undefined,
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
        state.totalRecords = payload?.data?.total_elements;
      }
    });
    builder.addCase(getStaffById.fulfilled, (state, { payload }: PayloadAction<IStaff> | any) => {
      state.staff = { ...payload?.staff, list_role: payload?.list_role };
      state.loading = false;
    });
  },
});
export const { setFilter, resetStatus } = accountSlice.actions;
export { accountSlice };
