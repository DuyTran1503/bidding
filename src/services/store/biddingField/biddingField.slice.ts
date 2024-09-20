import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IBiddingField, INewBiddingField } from "./biddingField.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import {
  getAllBiddingFields,
  createBiddingField,
  updateBiddingField,
  deleteBiddingField,
  getBiddingFieldById,
  changeStatusBiddingField,
  getBiddingFieldAllIds,
} from "./biddingField.thunk";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";

export interface IBiddingFieldInitialState extends IInitialState {
  biddingFields: INewBiddingField[];
  listBidingField: INewBiddingField[];
  activeBiddingField: IBiddingField | undefined;
}

const initialState: IBiddingFieldInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  biddingFields: [],
  listBidingField: [],
  activeBiddingField: undefined,
  totalRecords: 0, // Tổng số lượng mục
  totalPages: 0, // Tổng số trang
  pageSize: 10, // Số lượng mục trên mỗi trang
  currentPage: 1, // Trang hiện tại
  filter: {
    size: 10,
    page: 1,
  },
};

const biddingFieldSlice = createSlice({
  name: "bidding_field",
  initialState,
  reducers: {
    ...commonStaticReducers<IBiddingFieldInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding fields
    builder
      .addCase(getAllBiddingFields.fulfilled, (state, { payload }: PayloadAction<IResponse<INewBiddingField[] | any>>) => {
        if (payload.data) {
          state.biddingFields = payload.data.data;

          state.totalRecords = payload.data.total_elements; // Tổng số lượng mục
          state.totalPages = payload.data.total_pages; // Tổng số trang
          state.pageSize = payload.data.page_size; // Số lượng mục trên mỗi trang
          state.currentPage = payload.data.current_page; // Trang hiện tại
        }
      })
      .addCase(getAllBiddingFields.rejected, (state, { payload }: PayloadAction<any>) => {
        if (payload) {
          state.status = EFetchStatus.REJECTED;
          state.message = transformPayloadErrors(payload?.errors);
        }
      });
    builder
      .addCase(getBiddingFieldById.fulfilled, (state, { payload }: PayloadAction<IResponse<INewBiddingField> | any>) => {
        if (payload.data) {
          state.activeBiddingField = payload.data;
        }
      })
      .addCase(getBiddingFieldById.rejected, (state, { payload }: PayloadAction<any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });

    builder
      .addCase(getBiddingFieldAllIds.fulfilled, (state, { payload }: PayloadAction<INewBiddingField[] | any>) => {
        if (payload.data) {
          state.listBidingField = payload.data;
        }
      })
      .addCase(getBiddingFieldAllIds.rejected, (state, { payload }: PayloadAction<any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });

    // ? Create bidding field
    builder
      .addCase(createBiddingField.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBiddingField.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingField> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.biddingFields.push(payload.data);
        }
      })
      .addCase(createBiddingField.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update bidding field
    builder
      .addCase(updateBiddingField.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBiddingField.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingField> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
        if (payload.data) {
          const index = state.biddingFields.findIndex((field) => field.id === payload.data.id);
          if (index !== -1) {
            state.biddingFields[index] = payload.data;
          }
        }
      })
      .addCase(updateBiddingField.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete bidding field
    builder
      .addCase(deleteBiddingField.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteBiddingField.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.biddingFields = state.biddingFields?.filter((field) => field.id !== payload);
      })
      .addCase(deleteBiddingField.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusBiddingField.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusBiddingField.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusBiddingField.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = biddingFieldSlice.actions;
export { biddingFieldSlice };
