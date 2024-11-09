import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IWorkProgress } from "./workProgress.model";
import { createWorkProgress, deleteWorkProgress, getAllWorkProgresses, getListWorkProgresses, getWorkProgressById, updateWorkProgress } from "./workProgress.thunk";

export interface IWorkProgressInitialState extends IInitialState {
  workProgresses: IWorkProgress[];
  workProgress?: IWorkProgress | any;
  getListworkProgress: IWorkProgress[];
}

const initialState: IWorkProgressInitialState = {
  status: EFetchStatus.IDLE,
  workProgresses: [],
  getListworkProgress: [],
  workProgress: undefined,
  message: "",
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 50,
};

const workProgressSlice = createSlice({
  name: "work_progress",
  initialState,
  reducers: {
    ...commonStaticReducers<IWorkProgressInitialState>(),
    resetStatus(state) {
      state.status = EFetchStatus.IDLE;
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllWorkProgresses.fulfilled, (state, { payload }: PayloadAction<IResponse<IWorkProgress[]> | any>) => {
        if (payload.data) {
          state.workProgresses = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
        }
      })
      .addCase(getAllWorkProgresses.rejected, (state, { payload }: PayloadAction<IError[] | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getListWorkProgresses.fulfilled, (state, { payload }: PayloadAction<IResponse<IWorkProgress[]> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        if (payload.data) {
          state.getListworkProgress = payload.data;
        }
      })
      .addCase(getListWorkProgresses.rejected, (state, { payload }: PayloadAction<IError[] | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getWorkProgressById.fulfilled, (state, { payload }: PayloadAction<IWorkProgress> | any) => {
        state.workProgress = { ...payload?.data, project_id: payload?.data.project.id };
        state.loading = false;
      })
      .addCase(getWorkProgressById.rejected, (state, { payload }: PayloadAction<IError> | any) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(createWorkProgress.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createWorkProgress.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createWorkProgress.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateWorkProgress.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateWorkProgress.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateWorkProgress.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  
    // ? Delete tag
    builder
      .addCase(deleteWorkProgress.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteWorkProgress.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.workProgresses = state.workProgresses.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteWorkProgress.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});
export const { setFilter, resetStatus } = workProgressSlice.actions;
export { workProgressSlice };
