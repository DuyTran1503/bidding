import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IBiddingHistory } from "./biddingHistory.model"
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { 
  getAllBiddingHistorys, 
  createBiddingHistory, 
  updateBiddingHistory, 
  deleteBiddingHistory, 
  getBiddingHistoryById, 
  changeStatusBiddingHistory 
} from "./biddingHistory.thunk";
import { transformPayloadErrors } from '@/shared/utils/common/function';
import { IError } from '@/shared/interface/error';

export interface IBiddingHistoryInitialState extends IInitialState {
  biddingHistorys: IBiddingHistory[];
  activeBiddingHistory: IBiddingHistory | undefined;
}

const initialState: IBiddingHistoryInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  biddingHistorys: [],
  activeBiddingHistory: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const biddingHistorySlice = createSlice({
  name: "bidding_history",
  initialState,
  reducers: {
    ...commonStaticReducers<IBiddingHistoryInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding historys
    builder.addCase(getAllBiddingHistorys.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.biddingHistorys = payload.data.data;
          state.totalRecords = payload.data.total_elements;
          state.totalPages = payload.data.total_pages;
          state.pageSize = payload.data.page_size;
          state.currentPage = payload.data.current_page;
      }
  });

  // ? Get By ID
    builder.addCase(
      getBiddingHistoryById.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingHistory> | any>) => {
        if (payload.data) {
          state.activeBiddingHistory = payload.data;
          state.message = transformPayloadErrors(payload?.errors);
        }
      }
    );

    // ? Create bidding history
    builder
      .addCase(createBiddingHistory.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBiddingHistory.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingHistory> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.biddingHistorys.push(payload.data);
        }
      })
      .addCase(createBiddingHistory.rejected, (state, {payload}: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update bidding history
    builder
      .addCase(updateBiddingHistory.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBiddingHistory.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingHistory> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.biddingHistorys.findIndex((history) => history.id === payload.data.id);
          if (index !== -1) {
            state.biddingHistorys[index] = payload.data;
          }
        }
      })
      .addCase(updateBiddingHistory.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete bidding history
    builder
      .addCase(deleteBiddingHistory.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteBiddingHistory.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.biddingHistorys = state.biddingHistorys?.filter((history) => history.id !== payload);
      })
      .addCase(deleteBiddingHistory.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
      builder
      .addCase(changeStatusBiddingHistory.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusBiddingHistory.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusBiddingHistory.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = biddingHistorySlice.actions;
export { biddingHistorySlice };
