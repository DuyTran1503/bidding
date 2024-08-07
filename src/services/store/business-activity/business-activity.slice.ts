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
  updateBusinessActivity,
} from "./business-activity.thunk";

export interface IBusinessActivityInitialState extends IInitialState {
  businessActivities: IBusinessActivity[];
  businessActivity?: IBusinessActivity | any;
}

const initialState: IBusinessActivityInitialState = {
  status: EFetchStatus.IDLE,
  businessActivities: [],
  businessActivity: undefined,
  message: "",
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
  },

  extraReducers(builder) {
    builder.addCase(getAllBusinessActivity.fulfilled, (state, { payload }: PayloadAction<IResponse<IBusinessActivity[]> | any>) => {
      if (payload.data) {
        state.businessActivities = payload.data.data;
        state.totalRecords = payload?.data?.total_elements;
        state.number_of_elements = payload?.data?.number_of_elements;
      }
    });
    builder.addCase(getBusinessActivityById.fulfilled, (state, { payload }: PayloadAction<IBusinessActivity> | any) => {
      state.businessActivity = payload.data;
      state.loading = false;
    });
    builder
      .addCase(createBusinessActivity.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBusinessActivity.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createBusinessActivity.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(updateBusinessActivity.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBusinessActivity.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateBusinessActivity.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(changeStatusBusinessActivity.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusBusinessActivity.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusBusinessActivity.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
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
  },
});
export const { setFilter, resetStatus } = businessActivitySlice.actions;
export { businessActivitySlice };
