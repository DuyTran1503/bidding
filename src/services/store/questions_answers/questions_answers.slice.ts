import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { IQuestionsAnswers } from "./questions_answers.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { commonStaticReducers } from "@/services/shared";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";
import {
  changeStatusQuestionAnswer,
  createQuestionAnswer,
  deleteQuestionAnswer,
  getAllQuestionsAnswers,
  getListQuestionAnswers,
  getQuestionAnswerById,
  updateQuestionAnswer,
} from "./questions_answers.thunk";

export interface IQuestionsAnswersInitialState extends IInitialState {
  questions_answers: IQuestionsAnswers[];
  question_answer?: IQuestionsAnswers | any;
  listProjects?: IQuestionsAnswers[];
}
const initialState: IQuestionsAnswersInitialState = {
  status: EFetchStatus.IDLE,
  questions_answers: [],
  listProjects: [],
  question_answer: undefined,
  message: "",
  error: undefined,
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const questionsAnswersSlice = createSlice({
  name: "questions_answers",
  initialState,
  reducers: {
    ...commonStaticReducers<IQuestionsAnswersInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllQuestionsAnswers.fulfilled, (state, { payload }: PayloadAction<IResponse<IQuestionsAnswers[]> | any>) => {
        if (payload.data) {
          state.questions_answers = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllQuestionsAnswers.rejected, (state, { payload }: PayloadAction<IResponse<IQuestionsAnswers[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getQuestionAnswerById.fulfilled, (state, { payload }: PayloadAction<IQuestionsAnswers> | any) => {
        state.question_answer = payload.data;
        state.loading = false;
      })
      .addCase(getQuestionAnswerById.rejected, (state, { payload }: PayloadAction<IQuestionsAnswers> | any) => {
        state.question_answer = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createQuestionAnswer.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createQuestionAnswer.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createQuestionAnswer.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });

    builder
      .addCase(updateQuestionAnswer.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateQuestionAnswer.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateQuestionAnswer.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // builder
    //   .addCase(approveProject.pending, (state) => {
    //     state.status = EFetchStatus.PENDING;
    //   })
    //   .addCase(approveProject.fulfilled, (state) => {
    //     state.status = EFetchStatus.FULFILLED;
    //     state.message = "Phê duyệt thành công";
    //   })
    //   .addCase(approveProject.rejected, (state, { payload }: PayloadAction<IError | any>) => {
    //     state.status = EFetchStatus.REJECTED;
    //     state.message = transformPayloadErrors(payload?.errors);
    //   });
    builder
      .addCase(changeStatusQuestionAnswer.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusQuestionAnswer.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusQuestionAnswer.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteQuestionAnswer.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteQuestionAnswer.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.questions_answers = state.questions_answers.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteQuestionAnswer.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });

    builder
      .addCase(getListQuestionAnswers.fulfilled, (state, { payload }: PayloadAction<IResponse<IQuestionsAnswers[]> | any>) => {
        if (payload.data) {
          state.listProjects = payload.data;
        }
      })
      .addCase(getListQuestionAnswers.rejected, (state, { payload }: PayloadAction<IResponse<IQuestionsAnswers[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});
export const { fetching, setFilter, resetStatus, resetMessageError } = questionsAnswersSlice.actions;
export { questionsAnswersSlice };
