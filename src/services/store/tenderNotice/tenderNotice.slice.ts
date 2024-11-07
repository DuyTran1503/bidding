import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { ITenderNotice } from "./tenderNotice.model"
import { EFetchStatus } from "@/shared/enums/fetchStatus";

import { transformPayloadErrors } from '@/shared/utils/common/function';
import { IError } from '@/shared/interface/error';
import { changeStatusTenderNotice, createTenderNotice, deleteTenderNotice, getAllTenderNotices, getTenderNoticeById, updateTenderNotice } from './tenderNotice.thunk';
import { commonStaticReducers } from '@/services/shared';

export interface ITenderNoticeInitialState extends IInitialState {
  tenderNotices: ITenderNotice[];
  activeTenderNotice: ITenderNotice | undefined;
}

const initialState: ITenderNoticeInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  tenderNotices: [],
  activeTenderNotice: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const tenderNoticeSlice = createSlice({
  name: "tender_notice",
  initialState,
  reducers: {
    ...commonStaticReducers<ITenderNoticeInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding historys
    builder.addCase(getAllTenderNotices.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.tenderNotices = payload.data.data;
          state.totalRecords = payload.data.total_elements;
          state.totalPages = payload.data.total_pages;
          state.pageSize = payload.data.page_size;
          state.currentPage = payload.data.current_page;
      }
  });

  // ? Get By ID
    builder.addCase(
      getTenderNoticeById.fulfilled, (state, { payload }: PayloadAction<IResponse<ITenderNotice> | any>) => {
        if (payload.data) {
          state.activeTenderNotice = payload.data;
          state.message = transformPayloadErrors(payload?.errors);
        }
      }
    );

    // ? Create bidding history
    builder
      .addCase(createTenderNotice.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createTenderNotice.fulfilled, (state, { payload }: PayloadAction<IResponse<ITenderNotice> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.tenderNotices.push(payload.data);
        }
      })
      .addCase(createTenderNotice.rejected, (state, {payload}: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update bidding history
    builder
      .addCase(updateTenderNotice.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateTenderNotice.fulfilled, (state, { payload }: PayloadAction<IResponse<ITenderNotice> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.tenderNotices.findIndex((history) => history.id === payload.data.id);
          if (index !== -1) {
            state.tenderNotices[index] = payload.data;
          }
        }
      })
      .addCase(updateTenderNotice.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete bidding history
    builder
      .addCase(deleteTenderNotice.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteTenderNotice.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.tenderNotices = state.tenderNotices?.filter((history) => history.id !== payload);
      })
      .addCase(deleteTenderNotice.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
      builder
      .addCase(changeStatusTenderNotice.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusTenderNotice.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusTenderNotice.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = tenderNoticeSlice.actions;
export { tenderNoticeSlice };