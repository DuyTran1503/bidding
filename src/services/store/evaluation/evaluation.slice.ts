import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { commonStaticReducers } from "@/services/shared";
import {
  getAllEvaluations,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationById,
  changeStatusEvaluation,
} from "./evaluation.thunk";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";
import { IEvaluationCriteria } from "./evaluation.model";
import { data } from "../../../components/table/SecondaryTable";

export interface IEvaluationCriteriaInitialState extends IInitialState {
  evaluations: IEvaluationCriteria[];
  evaluation?: IEvaluationCriteria;
  listEvaluation?: IEvaluationCriteria[];
}

const initialState: IEvaluationCriteriaInitialState = {
  status: EFetchStatus.IDLE,
  message: "",
  evaluations: [],
  listEvaluation: [],
  evaluation: undefined,
  totalRecords: 0,
  totalPages: 0,
  pageSize: 10,
  currentPage: 1,
  filter: {
    size: 10,
    page: 1,
  },
};

const evaluationSlice = createSlice({
  name: "evaluation",
  initialState,
  reducers: {
    ...commonStaticReducers<IEvaluationCriteriaInitialState>(),
    resetStatus(state) {
      state.status = EFetchStatus.IDLE;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    // ? Get all bidding types
    builder.addCase(getAllEvaluations.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
      if (payload.data) {
        state.evaluations = payload.data.data;
        state.totalRecords = payload.data.total_elements;
        state.totalPages = payload.data.total_pages;
        state.pageSize = payload.data.page_size;
        state.currentPage = payload.data.current_page;
      }
    });

    // ? Get By ID
    builder.addCase(getEvaluationById.fulfilled, (state, { payload }: PayloadAction<IResponse<IEvaluationCriteria> | any>) => {
      if (payload.data) {
        state.ealuation = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
      }
    });

    // ? Create bidding type
    builder
      .addCase(createEvaluation.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createEvaluation.fulfilled, (state, { payload }: PayloadAction<IResponse<IEvaluationCriteria> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công";
        if (payload.data) {
          state.evaluations.push(payload.data);
        }
      })
      .addCase(createEvaluation.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Update bidding type
    builder
      .addCase(updateEvaluation.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateEvaluation.fulfilled, (state, { payload }: PayloadAction<IResponse<IEvaluationCriteria> | any>) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhập thành công";
        if (payload.data) {
          const index = state.evaluations.findIndex((type) => type.id === payload.data.id);
          if (index !== -1) {
            state.evaluations[index] = payload.data;
          }
        }
      })
      .addCase(updateEvaluation.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete bidding type
    builder
      .addCase(deleteEvaluation.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteEvaluation.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.listData = state.evaluations?.filter((type) => type.id !== payload);
      })
      .addCase(deleteEvaluation.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusEvaluation.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusEvaluation.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusEvaluation.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});

export const { resetStatus, setFilter } = evaluationSlice.actions;
export { evaluationSlice };
