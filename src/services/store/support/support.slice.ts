import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { ISupport } from "./support.model"
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import { 
  getAllSupports, 
  createSupport, 
  deleteSupport, 
  getSupportById, 
  changeStatusSupport 
} from "./support.thunk";
import { transformPayloadErrors } from '@/shared/utils/common/function';
import { IError } from '@/shared/interface/error';

export interface ISupportInitialState extends IInitialState {
  supports: ISupport[];
  activeSupport: ISupport | any;
}

const initialState: ISupportInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  supports: [],
  activeSupport: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    ...commonStaticReducers<ISupportInitialState>(),
  },
  extraReducers: (builder) => {
    // ? Get all Supports
    builder.addCase(getAllSupports.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
          state.supports = payload.data.data;
          state.totalRecords = payload.data.total_elements;
          state.totalPages = payload.data.total_pages;
          state.pageSize = payload.data.page_size;
          state.currentPage = payload.data.current_page;
      }
  });

  // ? Get By ID
    builder.addCase(
      getSupportById.fulfilled, (state, { payload }: PayloadAction<IResponse<ISupport> | any>) => {
        if (payload.data) {
          state.activeSupport = payload.data;
          state.message = transformPayloadErrors(payload?.errors);
        }
      }
    );

    // ? Create Support
    builder
      .addCase(createSupport.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createSupport.fulfilled, (state, { payload }: PayloadAction<IResponse<ISupport> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.supports.push(payload.data);
        }
      })
      .addCase(createSupport.rejected, (state, {payload}: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete Support
    builder
      .addCase(deleteSupport.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteSupport.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.supports = state.supports?.filter((type) => type.id !== payload);
      })
      .addCase(deleteSupport.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update the status
    builder
      .addCase(changeStatusSupport.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusSupport.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusSupport.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = supportSlice.actions;
export { supportSlice };
