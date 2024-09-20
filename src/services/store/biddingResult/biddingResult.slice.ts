import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IBiddingResult } from "./biddingResult.model"
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { 
  getAllBiddingResults, 
  createBiddingResult, 
  updateBiddingResult, 
  deleteBiddingResult, 
  getBiddingResultById, 
  changeStatusBiddingResult 
} from "./biddingResult.thunk";
import { transformPayloadErrors } from '@/shared/utils/common/function';
import { IError } from '@/shared/interface/error';

export interface IBiddingResultInitialState extends IInitialState {
  biddingResults: IBiddingResult[];
  activeBiddingResult: IBiddingResult | undefined;
}

const initialState: IBiddingResultInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  biddingResults: [],
  activeBiddingResult: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const biddingResultSlice = createSlice({
  name: "bidding_result",
  initialState,
  reducers: {
    ...commonStaticReducers<IBiddingResultInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding historys
    builder.addCase(getAllBiddingResults.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.biddingResults = payload.data.data;
          state.totalRecords = payload.data.total_elements;
          state.totalPages = payload.data.total_pages;
          state.pageSize = payload.data.page_size;
          state.currentPage = payload.data.current_page;
      }
  });

  // ? Get By ID
    builder.addCase(
      getBiddingResultById.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingResult> | any>) => {
        if (payload.data) {
          state.activeBiddingResult = payload.data;
          state.message = transformPayloadErrors(payload?.errors);
        }
      }
    );

    // ? Create bidding history
    builder
      .addCase(createBiddingResult.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createBiddingResult.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingResult> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.biddingResults.push(payload.data);
        }
      })
      .addCase(createBiddingResult.rejected, (state, {payload}: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update bidding history
    builder
      .addCase(updateBiddingResult.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateBiddingResult.fulfilled, (state, { payload }: PayloadAction<IResponse<IBiddingResult> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.biddingResults.findIndex((history) => history.id === payload.data.id);
          if (index !== -1) {
            state.biddingResults[index] = payload.data;
          }
        }
      })
      .addCase(updateBiddingResult.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete bidding history
    builder
      .addCase(deleteBiddingResult.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteBiddingResult.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.biddingResults = state.biddingResults?.filter((history) => history.id !== payload);
      })
      .addCase(deleteBiddingResult.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
      builder
      .addCase(changeStatusBiddingResult.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusBiddingResult.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusBiddingResult.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = biddingResultSlice.actions;
export { biddingResultSlice };
