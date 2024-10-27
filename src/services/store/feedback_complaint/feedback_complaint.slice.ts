import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { commonStaticReducers } from "@/services/shared";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";
import {
  changeStatusFeedbackComplaint,
  deleteFeedbackComplaint,
  getAllFeedbackComplaints,
  getFeedbackComplaintById,
  getListFeedbackComplaints,
  updateFeedbackComplaint,
} from "./feedback_complaint.thunk";
import { IFeedbackComplaint } from "./feedback_complaint.model";

export interface IFeedbackComplaintInitialState extends IInitialState {
  feedback_complaints: IFeedbackComplaint[];
  feeback_complaint?: IFeedbackComplaint | any;
  listFeedbackComplaints?: IFeedbackComplaint[];
}
const initialState: IFeedbackComplaintInitialState = {
  status: EFetchStatus.IDLE,
  feedback_complaints: [],
  listFeedbackComplaints: [],
  feeback_complaint: undefined,
  message: "",
  error: undefined,
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const feedbackComlaintSlice = createSlice({
  name: "feedback_complaint",
  initialState,
  reducers: {
    ...commonStaticReducers<IFeedbackComplaintInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllFeedbackComplaints.fulfilled, (state, { payload }: PayloadAction<IResponse<IFeedbackComplaint[]> | any>) => {
        if (payload.data) {
          state.feedback_complaints = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllFeedbackComplaints.rejected, (state, { payload }: PayloadAction<IResponse<IFeedbackComplaint[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getFeedbackComplaintById.fulfilled, (state, { payload }: PayloadAction<IFeedbackComplaint> | any) => {
        state.feedback_complaint = payload.data;
        state.loading = false;
      })
      .addCase(getFeedbackComplaintById.rejected, (state, { payload }: PayloadAction<IFeedbackComplaint> | any) => {
        state.feedback_complaint = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });

    builder
      .addCase(updateFeedbackComplaint.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateFeedbackComplaint.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateFeedbackComplaint.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusFeedbackComplaint.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusFeedbackComplaint.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusFeedbackComplaint.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteFeedbackComplaint.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteFeedbackComplaint.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.questions_answers = state.feedback_complaints.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteFeedbackComplaint.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });

    builder
      .addCase(getListFeedbackComplaints.fulfilled, (state, { payload }: PayloadAction<IResponse<IFeedbackComplaint[]> | any>) => {
        if (payload.data) {
          state.listFeedbackComplaints = payload.data;
        }
      })
      .addCase(getListFeedbackComplaints.rejected, (state, { payload }: PayloadAction<IResponse<IFeedbackComplaint[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
  },
});
export const { fetching, setFilter, resetStatus, resetMessageError } = feedbackComlaintSlice.actions;
export { feedbackComlaintSlice };
