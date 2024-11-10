import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import {
  changeStatusActiveEnterprise,
  changeStatusEnterprise,
  createEnterprise,
  deleteEnterprise,
  getAllEnterprise,
  getEnterpriseById,
  getIndustries,
  getListEnterprise,
  updateEnterprise,
} from "./enterprise.thunk";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IEnterprise } from "./enterprise.model";
import { IIndustry } from "../industry/industry.model";

export interface IEnterpriseInitialState extends IInitialState {
  enterprises: IEnterprise[];
  enterprise?: IEnterprise | any;
  industries?: IIndustry[];
  listEnterprise?: IEnterprise[];
}

const initialState: IEnterpriseInitialState = {
  status: EFetchStatus.IDLE,
  enterprises: [],
  listEnterprise: [],
  enterprise: undefined,
  industries: [],
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
          state.enterprises = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllEnterprise.rejected, (state, { payload }: PayloadAction<IResponse<IEnterprise[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getEnterpriseById.fulfilled, (state, { payload }: PayloadAction<IEnterprise> | any) => {
        state.enterprise = payload.data;
        state.loading = false;
      })
      .addCase(getEnterpriseById.rejected, (state, { payload }: PayloadAction<IEnterprise> | any) => {
        state.enterprise = payload.data;
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
        state.message = transformPayloadErrors(payload?.errors || payload.message);
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
        state.message = transformPayloadErrors(payload?.errors || payload.message);
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
        state.message = transformPayloadErrors(payload?.errors || payload.message);
      });
    // ? Delete tag
    builder
      .addCase(deleteEnterprise.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteEnterprise.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.enterprises = state.enterprises.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteEnterprise.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors || payload?.message);
      });
    builder
      .addCase(getIndustries.fulfilled, (state, { payload }: PayloadAction<IResponse<IIndustry[]> | any>) => {
        if (payload.data) {
          state.industries = payload.data.data;
        }
      })
      .addCase(getIndustries.rejected, (state, { payload }: PayloadAction<IResponse<IIndustry[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors || payload.message);
      });
    builder
      .addCase(getListEnterprise.fulfilled, (state, { payload }: PayloadAction<IResponse<IEnterprise[]> | any>) => {
        if (payload.data) {
          state.listEnterprise = payload.data;
        }
      })
      .addCase(getListEnterprise.rejected, (state, { payload }: PayloadAction<IResponse<IEnterprise[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors || payload.message);
      });
    builder
      .addCase(changeStatusActiveEnterprise.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusActiveEnterprise.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusActiveEnterprise.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors || payload.message);
      });
  },
});
export const { fetching, setFilter, resetStatus, resetMessageError } = enterpriseSlice.actions;
export { enterpriseSlice };
