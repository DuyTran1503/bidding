import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IBiddingField } from "./biddingField.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { getAllBiddingFields, createBiddingField, updateBiddingField, deleteBiddingField, getBiddingFieldById } from "./biddingField.thunk";

export interface IBiddingFieldInitialState extends IInitialState {
  biddingFields: IBiddingField[];
  activeBiddingField: IBiddingField | undefined;
}

const initialState: IBiddingFieldInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  biddingFields: [],
  activeBiddingField: undefined,
  totalRecords: 0, // Tổng số lượng mục
  totalPages: 0,   // Tổng số trang
  pageSize: 10,    // Số lượng mục trên mỗi trang
  currentPage: 1,  // Trang hiện tại
  filter: {
    size: 10,
    page: 1,
  },
};

const biddingFieldSlice = createSlice({
  name: "biddingField",
  initialState,
  reducers: {
    ...commonStaticReducers<IBiddingFieldInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding fields
    builder.addCase(getAllBiddingFields.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.biddingFields = payload.data.data;
          state.totalRecords = payload.data.total_elements;  // Tổng số lượng mục
          state.totalPages = payload.data.total_pages;      // Tổng số trang
          state.pageSize = payload.data.page_size;          // Số lượng mục trên mỗi trang
          state.currentPage = payload.data.current_page;    // Trang hiện tại
      }
  });
    builder.addCase(
      getBiddingFieldById.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingField> | any>) => {
        if (payload.data) {
          state.activeBiddingField = payload.data;
        }
      }
    );

    // ? Create bidding field
    builder
      .addCase(createBiddingField.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBiddingField.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingField> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Created successfully";
        if (payload.data) {
          state.biddingFields.push(payload.data);
        }
      })
      .addCase(createBiddingField.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
        state.message = "Creation failed";
      });
    // ? Update bidding field
    builder
      .addCase(updateBiddingField.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBiddingField.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingField> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Updated successfully";
        if (payload.data) {
          const index = state.biddingFields.findIndex((field) => field.id === payload.data.id);
          if (index !== -1) {
            state.biddingFields[index] = payload.data;
          }
        }
      })
      .addCase(updateBiddingField.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
        state.message = "Update failed";
      });
    // ? Delete bidding field
    builder
      .addCase(deleteBiddingField.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteBiddingField.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Deleted successfully";
        state.biddingFields = state.biddingFields.filter((field) => field.id !== payload);
      })
      .addCase(deleteBiddingField.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
        state.message = "Deletion failed";
      });
  },
});

export const { resetStatus, setFilter } = biddingFieldSlice.actions;
export { biddingFieldSlice };
