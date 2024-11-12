import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IEvaluate } from "./evaluate.model"
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { 
  getAllEvaluates, 
  createEvaluate, 
  updateEvaluate, 
  deleteEvaluate, 
  getEvaluateById, 
} from "./evaluate.thunk";
import { IError } from '@/shared/interface/error';

export interface IEvaluateInitialState extends IInitialState {
  evaluates: IEvaluate[];
  activeEvaluate: IEvaluate | undefined;
}

const initialState: IEvaluateInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  evaluates: [],
  activeEvaluate: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const evaluateSlice = createSlice({
  name: "evaluate",
  initialState,
  reducers: {
    ...commonStaticReducers<IEvaluateInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all bidding types
    builder.addCase(getAllEvaluates.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.evaluates = payload.data.data;
          state.totalRecords = payload.data.total_elements;
          state.totalPages = payload.data.total_pages;
          state.pageSize = payload.data.page_size;
          state.currentPage = payload.data.current_page;
      }
  });

  // ? Get By ID
    builder.addCase(
      getEvaluateById.fulfilled, (state, { payload }: PayloadAction<IResponse<IEvaluate> | any>) => {
        if (payload.data) {
          state.activeEvaluate = payload.data;
          state.message = payload.message;
        }
      }
    );

    // ? Create bidding type
    builder
      .addCase(createEvaluate.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createEvaluate.fulfilled, (state, { payload }: PayloadAction<IResponse<IEvaluate> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.evaluates.push(payload.data);
        }
      })
      .addCase(createEvaluate.rejected, (state, {payload}: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = payload.message;
      });
    // ? Update bidding type
    builder
      .addCase(updateEvaluate.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateEvaluate.fulfilled, (state, { payload }: PayloadAction<IResponse<IEvaluate> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.evaluates.findIndex((type) => type.id === payload.data.id);
          if (index !== -1) {
            state.evaluates[index] = payload.data;
          }
        }
      })
      .addCase(updateEvaluate.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = payload.message;
      });
    // ? Delete bidding type
    builder
      .addCase(deleteEvaluate.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteEvaluate.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.evaluates = state.evaluates?.filter((type) => type.id !== payload);
      })
      .addCase(deleteEvaluate.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = payload.message;
      });
  },
});

export const { resetStatus, setFilter } = evaluateSlice.actions;
export { evaluateSlice };
