import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import { IStaff } from "./account.model";
import { changeStatusStaff, createStaff, deleteStaff, getAllStaff, getStaffById, updateStaff } from "./account.thunk";

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
    builder
      .addCase(createStaff.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createStaff.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createStaff.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(updateStaff.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateStaff.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Updated successfully";
      })
      .addCase(updateStaff.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(changeStatusStaff.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusStaff.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusStaff.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    // ? Delete tag
    builder
      .addCase(deleteStaff.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteStaff.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Deleted successfully";
        state.staffs = state.staffs.filter((item) => String(item.id_user) !== payload);
      })
      .addCase(deleteStaff.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
  },
});
export const { setFilter, resetStatus } = accountSlice.actions;
export { accountSlice };
