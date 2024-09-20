import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import { IStaff } from "./account.model";
import { changeStatusStaff, createStaff, deleteStaff, getAllStaff, getListStaff, getStaffById, updateStaff } from "./account.thunk";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";

export interface IAccountInitialState extends IInitialState {
  staffs: IStaff[];
  staff?: IStaff | any;
  getListStaff: IStaff[];
}

const initialState: IAccountInitialState = {
  status: EFetchStatus.IDLE,
  staffs: [],
  getListStaff: [],
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
    resetStatus(state) {
      state.status = EFetchStatus.IDLE;
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllStaff.fulfilled, (state, { payload }: PayloadAction<IResponse<IStaff[]> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        if (payload.data) {
          state.staffs = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
        }
      })
      .addCase(getAllStaff.rejected, (state, { payload }: PayloadAction<IError[] | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getListStaff.fulfilled, (state, { payload }: PayloadAction<IResponse<IStaff[]> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        if (payload.data) {
          state.getListStaff = payload.data;
        }
      })
      .addCase(getListStaff.rejected, (state, { payload }: PayloadAction<IError[] | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getStaffById.fulfilled, (state, { payload }: PayloadAction<IStaff> | any) => {
        state.staff = { ...payload?.staff, list_role: payload?.list_role };
        state.loading = false;
      })
      .addCase(getStaffById.rejected, (state, { payload }: PayloadAction<IError> | any) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(createStaff.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createStaff.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createStaff.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateStaff.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateStaff.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateStaff.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusStaff.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusStaff.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusStaff.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteStaff.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteStaff.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.staffs = state.staffs.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteStaff.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});
export const { setFilter, resetStatus } = accountSlice.actions;
export { accountSlice };
