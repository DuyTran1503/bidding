import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import { IBusinessActivity } from "./business-activity.model";
import {
  changeStatusBusinessActivity,
  createBusinessActivity,
  deleteBusinessActivity,
  getAllBusinessActivity,
  getBusinessActivityById,
  getListBusinessActivity,
  updateBusinessActivity,
} from "./business-activity.thunk";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";

export interface IBusinessActivityInitialState extends IInitialState {
  businessActivities: IBusinessActivity[];
  businessActivity?: IBusinessActivity | any;
  listBusinessActivities: IBusinessActivity[];
}

const initialState: IBusinessActivityInitialState = {
  status: EFetchStatus.IDLE,
  businessActivities: [],
  listBusinessActivities: [],
  businessActivity: undefined,
  message: "",
  error: undefined,
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const businessActivitySlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    ...commonStaticReducers<IBusinessActivityInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllBusinessActivity.fulfilled, (state, { payload }: PayloadAction<IResponse<IBusinessActivity[]> | any>) => {
        if (payload.data) {
          state.businessActivities = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllBusinessActivity.rejected, (state, { payload }: PayloadAction<IResponse<IBusinessActivity[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getBusinessActivityById.fulfilled, (state, { payload }: PayloadAction<IBusinessActivity> | any) => {
        state.businessActivity = payload.data;
        state.loading = false;
      })
      .addCase(getBusinessActivityById.rejected, (state, { payload }: PayloadAction<IBusinessActivity> | any) => {
        state.businessActivity = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createBusinessActivity.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBusinessActivity.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createBusinessActivity.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateBusinessActivity.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBusinessActivity.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateBusinessActivity.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusBusinessActivity.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusBusinessActivity.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusBusinessActivity.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteBusinessActivity.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteBusinessActivity.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.businessActivities = state.businessActivities.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteBusinessActivity.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(getListBusinessActivity.fulfilled, (state, { payload }: PayloadAction<IResponse<IBusinessActivity[]> | any>) => {
        if (payload.data) {
          state.listBusinessActivities = payload.data;
        }
      })
      .addCase(getListBusinessActivity.rejected, (state, { payload }: PayloadAction<IResponse<IBusinessActivity[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});
export const { fetching, setFilter, resetStatus, resetMessageError } = businessActivitySlice.actions;
export { businessActivitySlice };
