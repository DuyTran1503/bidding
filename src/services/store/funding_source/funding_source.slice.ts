import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { commonStaticReducers } from "@/services/shared";
import {
  changeStatusFundingSource,
  createFundingSource,
  deleteFundingSources,
  getAllFundingSources,
  getFundingSourceById,
  updateFundingSource,
} from "./funding_source.thunk";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IFundingSource } from "./funding_source.model";

export interface IFundingSourceInitialState extends IInitialState {
  fundingSources: IFundingSource[];
  fundingSource?: IFundingSource | any;
  listFundingSources: IFundingSource[];
}

const initialState: IFundingSourceInitialState = {
  status: EFetchStatus.IDLE,
  fundingSources: [],
  listFundingSources: [],
  fundingSource: undefined,
  message: "",
  error: undefined,
  filter: {
    size: 10,
    page: 1,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const fundingSourceSlice = createSlice({
  name: "funding_source",
  initialState,
  reducers: {
    ...commonStaticReducers<IFundingSourceInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllFundingSources.fulfilled, (state, { payload }: PayloadAction<IResponse<IFundingSource[]> | any>) => {
        if (payload.data) {
          state.fundingSources = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllFundingSources.rejected, (state, { payload }: PayloadAction<IResponse<IFundingSource[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });

    builder
      .addCase(getFundingSourceById.fulfilled, (state, { payload }: PayloadAction<IFundingSource[]> | any) => {
        state.fundingSource = payload.data;
        state.loading = false;
      })
      .addCase(getFundingSourceById.rejected, (state, { payload }: PayloadAction<IFundingSource> | any) => {
        state.fundingSource = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createFundingSource.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createFundingSource.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createFundingSource.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateFundingSource.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateFundingSource.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateFundingSource.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
      // change
    builder
      .addCase(changeStatusFundingSource.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusFundingSource.fulfilled, (state,) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Trạng thái hoạt động của nguồn tài trợ đã được cập nhật thành công";
      })
      .addCase(changeStatusFundingSource.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteFundingSources.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteFundingSources.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.businessActivities = state.fundingSources.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteFundingSources.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(getListBusinessActivity.fulfilled, (state, { payload }: PayloadAction<IResponse<IFundingSource[]> | any>) => {
        if (payload.data) {
          state.listBusinessActivities = payload.data;
        }
      })
      .addCase(getListBusinessActivity.rejected, (state, { payload }: PayloadAction<IResponse<IFundingSource[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter, fetching, resetMessageError } = fundingSourceSlice.actions;
export { fundingSourceSlice };
