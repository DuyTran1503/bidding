import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IBiddingType } from "./biddingType.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { 
  getAllBiddingTypes, 
  createBiddingType, 
  updateBiddingType, 
  deleteBiddingType, 
  getBiddingTypeById, 
  changeStatusBiddingType 
} from "./biddingType.thunk";

export interface IBiddingTypeInitialState extends IInitialState {
  biddingTypes: IBiddingType[];
  activeBiddingType: IBiddingType | undefined;
}

const initialState: IBiddingTypeInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  biddingTypes: [],
  activeBiddingType: undefined,
  totalRecords: 0, // Tổng số lượng mục
  totalPages: 0,   // Tổng số trang
  pageSize: 10,    // Số lượng mục trên mỗi trang
  currentPage: 1,  // Trang hiện tại
  filter: {
    size: 10,
    page: 1,
  },
};

const biddingTypeSlice = createSlice({
  name: "biddingType",
  initialState,
  reducers: {
    ...commonStaticReducers<IBiddingTypeInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding types
    builder.addCase(getAllBiddingTypes.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.biddingTypes = payload.data.data;
          state.totalRecords = payload.data.total_elements;  // Tổng số lượng mục
          state.totalPages = payload.data.total_pages;      // Tổng số trang
          state.pageSize = payload.data.page_size;          // Số lượng mục trên mỗi trang
          state.currentPage = payload.data.current_page;    // Trang hiện tại
      }
  });

  // ? Get By ID
    builder.addCase(
      getBiddingTypeById.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingType> | any>) => {
        if (payload.data) {
          state.activeBiddingType = payload.data;
        }
      }
    );

    // ? Create bidding type
    builder
      .addCase(createBiddingType.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBiddingType.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingType> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Created successfully";
        if (payload.data) {
          state.biddingTypes.push(payload.data);
        }
      })
      .addCase(createBiddingType.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
        state.message = "Creation failed";
      });
    // ? Update bidding type
    builder
      .addCase(updateBiddingType.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBiddingType.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingType> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Updated successfully";
        if (payload.data) {
          const index = state.biddingTypes.findIndex((type) => type.id === payload.data.id);
          if (index !== -1) {
            state.biddingTypes[index] = payload.data;
          }
        }
      })
      .addCase(updateBiddingType.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
        state.message = "Update failed";
      });
    // ? Delete bidding type
    builder
      .addCase(deleteBiddingType.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteBiddingType.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Deleted successfully";
        state.biddingTypes = state.biddingTypes?.filter((type) => type.id !== payload);
      })
      .addCase(deleteBiddingType.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
        state.message = "Deletion failed";
      });
      builder
      .addCase(changeStatusBiddingType.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusBiddingType.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusBiddingType.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
  },
});

export const { resetStatus, setFilter } = biddingTypeSlice.actions;
export { biddingTypeSlice };
