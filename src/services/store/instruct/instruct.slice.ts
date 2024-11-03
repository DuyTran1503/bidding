import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { commonStaticReducers } from "@/services/shared";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IInstruct } from "./instruct.mode";
import { changeStatusInstruct, createInstruct, deleteInstruct, getAllInstructs, getInstructById, getListInstruct, updateInstruct } from "./instruct.thunk";

export interface IInstructInitialState extends IInitialState {
  instructs: IInstruct[];
  instruct?: IInstruct | any;
  listInstructs: IInstruct[];
}

const initialState: IInstructInitialState = {
  status: EFetchStatus.IDLE,
  instructs: [],
  listInstructs: [],
  instruct: undefined,
  message: "",
  error: undefined,
  filter: {
    size: 10,
    page: 1,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const insTructSlice = createSlice({
  name: "intruct",
  initialState,
  reducers: {
    ...commonStaticReducers<IInstructInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllInstructs.fulfilled, (state, { payload }: PayloadAction<IResponse<IInstruct[]> | any>) => {
        if (payload.data) {
          state.instructs = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllInstructs.rejected, (state, { payload }: PayloadAction<IResponse<IInstruct[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });

    builder
      .addCase(getInstructById.fulfilled, (state, { payload }: PayloadAction<IInstruct[]> | any) => {
        state.instruct = payload.data;
        state.loading = false;
      })
      .addCase(getInstructById.rejected, (state, { payload }: PayloadAction<IInstruct> | any) => {
        state.instruct = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createInstruct.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createInstruct.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createInstruct.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateInstruct.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateInstruct.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateInstruct.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // change
    builder
      .addCase(changeStatusInstruct.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusInstruct.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Trạng thái hoạt động của nguồn tài trợ đã được cập nhật thành công";
      })
      .addCase(changeStatusInstruct.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteInstruct.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteInstruct.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
      })
      .addCase(deleteInstruct.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(getListInstruct.fulfilled, (state, { payload }: PayloadAction<IResponse<IInstruct[]> | any>) => {
        if (payload.data) {
          state.listInstructs = payload.data;
        }
      })
      .addCase(getListInstruct.rejected, (state, { payload }: PayloadAction<IResponse<IInstruct[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter, fetching, resetMessageError } = insTructSlice.actions;
export { insTructSlice };
