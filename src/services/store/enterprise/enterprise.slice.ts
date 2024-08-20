import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import {
  changeStatusEnterprise,
  createEnterprise,
  deleteEnterprise,
  getAllEnterprise,
  getEnterpriseById,
  updateEnterprise,
} from "./enterprise.thunk";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";

export interface IEnterpriseInitialState extends IInitialState {
  enterprises: IEnterprise[];
  enterprise?: IEnterprise | any;
}

const initialState: IEnterpriseInitialState = {
  status: EFetchStatus.IDLE,
  enterprises: [],
  enterprise: undefined,
  message: "",
  error: undefined,
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const enterpriseSlice = createSlice({
  name: "enterprise",
  initialState,
  reducers: {
    ...commonStaticReducers<IEnterpriseInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllEnterprise.fulfilled, (state, { payload }: PayloadAction<IResponse<IEnterprise[]> | any>) => {
        if (payload.data) {
          state.businessActivities = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllEnterprise.rejected, (state, { payload }: PayloadAction<IResponse<IEnterprise[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getEnterpriseById.fulfilled, (state, { payload }: PayloadAction<IEnterprise> | any) => {
        state.businessActivity = payload.data;
        state.loading = false;
      })
      .addCase(getEnterpriseById.rejected, (state, { payload }: PayloadAction<IEnterprise> | any) => {
        state.businessActivity = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createEnterprise.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createEnterprise.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createEnterprise.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateEnterprise.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateEnterprise.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateEnterprise.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusEnterprise.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusEnterprise.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusEnterprise.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteEnterprise.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteEnterprise.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.businessActivities = state.enterprises.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteEnterprise.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
  },
});
export const { fetching, setFilter, resetStatus, resetMessageError } = enterpriseSlice.actions;
export { enterpriseSlice };
