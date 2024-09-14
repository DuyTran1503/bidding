import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IBidBond } from "./bidBond.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { commonStaticReducers } from "@/services/shared";
import { changeStatusBidBond, createBidBond, deleteBidBond, getAllBidBonds, getBidBondById, getListBidBond, updateBidBond } from "./bidBond.thunk";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";

export interface IBidBondInitialState extends IInitialState {
  bidBonds: IBidBond[];
  bidBond?: IBidBond | any;
  listBidBonds: IBidBond[];
}

const initialState: IBidBondInitialState = {
  status: EFetchStatus.IDLE,
  bidBonds: [],
  listBidBonds: [],
  bidBond: undefined,
  message: "",
  error: undefined,
  filter: {
    size: 10,
    page: 1,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const bidBondSlice = createSlice({
  name: "bid_bond",
  initialState,
  reducers: {
    ...commonStaticReducers<IBidBondInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllBidBonds.fulfilled, (state, { payload }: PayloadAction<IResponse<IBidBond[]> | any>) => {
        if (payload.data) {
          state.fundingSources = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllBidBonds.rejected, (state, { payload }: PayloadAction<IResponse<IBidBond[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });

    builder
      .addCase(getBidBondById.fulfilled, (state, { payload }: PayloadAction<IBidBond[]> | any) => {
        state.fundingSource = payload.data;
        state.loading = false;
      })
      .addCase(getBidBondById.rejected, (state, { payload }: PayloadAction<IBidBond> | any) => {
        state.fundingSource = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createBidBond.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBidBond.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createBidBond.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateBidBond.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBidBond.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateBidBond.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // change
    builder
      .addCase(changeStatusBidBond.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusBidBond.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Trạng thái hoạt động của bão lãnh dự thầu đã được cập nhật thành công";
      })
      .addCase(changeStatusBidBond.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteBidBond.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteBidBond.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.businessActivities = state.bidBonds.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteBidBond.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(getListBidBond.fulfilled, (state, { payload }: PayloadAction<IResponse<IBidBond[]> | any>) => {
        if (payload.data) {
          state.listBusinessActivities = payload.data;
        }
      })
      .addCase(getListBidBond.rejected, (state, { payload }: PayloadAction<IResponse<IBidBond[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export { bidBondSlice };
