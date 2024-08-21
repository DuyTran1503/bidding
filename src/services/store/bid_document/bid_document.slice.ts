import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import {
  changeStatusBidDocument,
  createBidDocument,
  deleteBidDocument,
  getAllBidDocument,
  getBidDocumentById,
  updateBidDocument,
} from "./bid_document.thunk";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IBidDocument } from "./bid_document.model";

export interface IBidDocumentInitialState extends IInitialState {
  bidDocuments: IBidDocument[];
  bidDocument?: IBidDocument | any;
}

const initialState: IBidDocumentInitialState = {
  status: EFetchStatus.IDLE,
  bidDocuments: [],
  bidDocument: undefined,
  message: "",
  error: undefined,
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const bidDocumentSlice = createSlice({
  name: "bid_document",
  initialState,
  reducers: {
    ...commonStaticReducers<IBidDocumentInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllBidDocument.fulfilled, (state, { payload }: PayloadAction<IResponse<IBidDocument[]> | any>) => {
        if (payload.data) {
          state.bidDocuments = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllBidDocument.rejected, (state, { payload }: PayloadAction<IResponse<IBidDocument[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getBidDocumentById.fulfilled, (state, { payload }: PayloadAction<IBidDocument> | any) => {
        state.bidDocument = payload.data;
        state.loading = false;
      })
      .addCase(getBidDocumentById.rejected, (state, { payload }: PayloadAction<IBidDocument> | any) => {
        state.bidDocument = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createBidDocument.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBidDocument.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createBidDocument.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateBidDocument.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBidDocument.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateBidDocument.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusBidDocument.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusBidDocument.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusBidDocument.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteBidDocument.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteBidDocument.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.businessActivities = state.bidDocuments.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteBidDocument.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
  },
});
export const { fetching, setFilter, resetStatus, resetMessageError } = bidDocumentSlice.actions;
export { bidDocumentSlice };
