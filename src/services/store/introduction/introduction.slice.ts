import { commonStaticReducers } from "@/services/shared";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IIntroduction } from "./introduction.moldel";
import {
  changeStatusIntroduction,
  createIntroduction,
  deleteIntroduction,
  getAllIntroductions,
  getIntroduction,
  getIntroductionById,
  updateIntroduction
} from "./introduction.thunk";

export interface IIntroductionInitialState extends IInitialState {
  introductions: IIntroduction[];
  introduction?: IIntroduction | any;
}

const initialState: IIntroductionInitialState = {
  status: EFetchStatus.IDLE,
  introductions: [],
  introduction: undefined,
  message: "",
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const introductionSlice = createSlice({
  name: "introduction",
  initialState,
  reducers: {
    ...commonStaticReducers<IIntroductionInitialState>(),
  },

  extraReducers(builder) {
    builder
      .addCase(getAllIntroductions.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
        if (payload.data) {
          state.introductions = payload.data.data;
          state.totalRecords = payload.data.total_elements;
          state.totalPages = payload.data.total_pages;
          state.pageSize = payload.data.page_size;
          state.currentPage = payload.data.current_page;
        }
      })

    builder
      .addCase(getIntroduction.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
        if (payload.data) {
          state.introduction = payload.data;
        }
      })

    builder
      .addCase(getIntroductionById.fulfilled, (state, { payload }: PayloadAction<IIntroduction[]> | any) => {
        state.introduction = payload.data;
        state.loading = false;
      })
      .addCase(getIntroductionById.rejected, (state, { payload }: PayloadAction<IIntroduction> | any) => {
        state.introduction = payload.data;
        state.message = payload.message || transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createIntroduction.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createIntroduction.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createIntroduction.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateIntroduction.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateIntroduction.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateIntroduction.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = payload.message || transformPayloadErrors(payload?.errors);
      });
    // change
    builder
      .addCase(changeStatusIntroduction.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusIntroduction.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Trạng thái hoạt động của nguồn tài trợ đã được cập nhật thành công";
      })
      .addCase(changeStatusIntroduction.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteIntroduction.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteIntroduction.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
      })
      .addCase(deleteIntroduction.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
  },
});

export const { resetStatus, setFilter } = introductionSlice.actions;
export { introductionSlice };
