import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import {
  changeStatusIndustry,
  createIndustry,
  deleteIndustry,
  getAllIndustry,
  getIndustries,
  getIndustryById,
  updateIndustry,
} from "./industry.thunk";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IIndustry } from "./industry.model";

export interface IIndustryInitialState extends IInitialState {
  industries: IIndustry[];
  industry?: IIndustry | any;
  listIndustry: IIndustry[];
}

const initialState: IIndustryInitialState = {
  status: EFetchStatus.IDLE,
  industries: [],
  industry: undefined,
  listIndustry: [],
  message: "",
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const industrySlice = createSlice({
  name: "industry",
  initialState,
  reducers: {
    ...commonStaticReducers<IIndustryInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllIndustry.fulfilled, (state, { payload }: PayloadAction<IResponse<IIndustry[]> | any>) => {
        if (payload.data) {
          state.industries = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllIndustry.rejected, (state, { payload }: PayloadAction<IResponse<IIndustry[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getIndustryById.fulfilled, (state, { payload }: PayloadAction<IIndustry> | any) => {
        state.industry = payload.data;
        state.loading = false;
      })
      .addCase(getIndustryById.rejected, (state, { payload }: PayloadAction<IIndustry> | any) => {
        state.industry = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createIndustry.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createIndustry.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createIndustry.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateIndustry.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateIndustry.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateIndustry.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusIndustry.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusIndustry.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Trạng thái hoạt động của ngành nghề đã được cập nhật thành công";
      })
      .addCase(changeStatusIndustry.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteIndustry.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteIndustry.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.industries = state.industries.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteIndustry.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(getIndustries.fulfilled, (state, { payload }: PayloadAction<IResponse<IIndustry[]> | any>) => {
        if (payload.data) {
          state.listIndustry = payload.data;
        }
      })
      .addCase(getIndustries.rejected, (state, { payload }: PayloadAction<IResponse<IIndustry[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});
export const { fetching, setFilter, resetStatus, resetMessageError } = industrySlice.actions;
export { industrySlice };
