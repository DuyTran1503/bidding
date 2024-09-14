import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { ISelectionMethod } from "./selectionMethod.model"
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { 
  getAllSelectionMethods, 
  createSelectionMethod, 
  updateSelectionMethod, 
  deleteSelectionMethod, 
  getSelectionMethodById, 
  changeStatusSelectionMethod 
} from "./selectionMethod.thunk";
import { transformPayloadErrors } from '@/shared/utils/common/function';
import { IError } from '@/shared/interface/error';

export interface ISelectionMethodInitialState extends IInitialState {
  selectionMethods: ISelectionMethod[];
  activeSelectionMethod: ISelectionMethod | undefined;
}

const initialState: ISelectionMethodInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  selectionMethods: [],
  activeSelectionMethod: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const selectionMethodSlice = createSlice({
  name: "selection_method",
  initialState,
  reducers: {
    ...commonStaticReducers<ISelectionMethodInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all selection methods
    builder.addCase(getAllSelectionMethods.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.selectionMethods = payload.data.data;
          state.totalRecords = payload.data.total_elements;
          state.totalPages = payload.data.total_pages;
          state.pageSize = payload.data.page_size;
          state.currentPage = payload.data.current_page;
      }
  });

  // ? Get By ID
    builder.addCase(
      getSelectionMethodById.fulfilled, (state, { payload }: PayloadAction<IResponse<ISelectionMethod> | any>) => {
        if (payload.data) {
          state.activeSelectionMethod = payload.data;
          state.message = transformPayloadErrors(payload?.errors);
        }
      }
    );

    // ? Create selection method
    builder
      .addCase(createSelectionMethod.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createSelectionMethod.fulfilled, (state, { payload }: PayloadAction<IResponse<ISelectionMethod> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.selectionMethods.push(payload.data);
        }
      })
      .addCase(createSelectionMethod.rejected, (state, {payload}: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update selection method
    builder
      .addCase(updateSelectionMethod.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateSelectionMethod.fulfilled, (state, { payload }: PayloadAction<IResponse<ISelectionMethod> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.selectionMethods.findIndex((type) => type.id === payload.data.id);
          if (index !== -1) {
            state.selectionMethods[index] = payload.data;
          }
        }
      })
      .addCase(updateSelectionMethod.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete selection method
    builder
      .addCase(deleteSelectionMethod.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteSelectionMethod.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.selectionMethods = state.selectionMethods?.filter((type) => type.id !== payload);
      })
      .addCase(deleteSelectionMethod.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
      builder
      .addCase(changeStatusSelectionMethod.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusSelectionMethod.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusSelectionMethod.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = selectionMethodSlice.actions;
export { selectionMethodSlice };
