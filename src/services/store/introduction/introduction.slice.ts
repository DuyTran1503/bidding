import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { commonStaticReducers } from "@/services/shared";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IIntroduction } from "./introduction.moldel";
import {
  changeStatusIntroduction,
  createIntroduction,
  deleteIntroduction,
  getAllIntroductions,
  getIntroductionById,
  getListIntroduction,
  updateIntroduction,
} from "./introduction.thunk";

export interface IIntroductionInitialState extends IInitialState {
  introductions: IIntroduction[];
  introduction?: IIntroduction | any;
  listIntroductions: IIntroduction[];
}

const initialState: IIntroductionInitialState = {
  status: EFetchStatus.IDLE,
  introductions: [],
  listIntroductions: [],
  introduction: undefined,
  message: "",
  error: undefined,
  filter: {
    size: 10,
    page: 1,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const introductionSlice = createSlice({
  name: "introduction",
  initialState,
  reducers: {
    ...commonStaticReducers<IIntroductionInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllIntroductions.fulfilled, (state, { payload }: PayloadAction<IResponse<IIntroduction[]> | any>) => {
        if (payload.data) {
          state.introductions = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllIntroductions.rejected, (state, { payload }: PayloadAction<IResponse<IIntroduction[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });

    builder
      .addCase(getIntroductionById.fulfilled, (state, { payload }: PayloadAction<IIntroduction[]> | any) => {
        state.introduction = payload.data;
        state.loading = false;
      })
      .addCase(getIntroductionById.rejected, (state, { payload }: PayloadAction<IIntroduction> | any) => {
        state.introduction = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
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
        state.message = transformPayloadErrors(payload?.errors);
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
    builder
      .addCase(getListIntroduction.fulfilled, (state, { payload }: PayloadAction<IResponse<IIntroduction[]> | any>) => {
        if (payload.data) {
          state.listIntroductions = payload.data;
        }
      })
      .addCase(getListIntroduction.rejected, (state, { payload }: PayloadAction<IResponse<IIntroduction[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter, fetching, resetMessageError } = introductionSlice.actions;
export { introductionSlice };
