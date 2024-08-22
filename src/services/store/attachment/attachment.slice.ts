import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import {
  changeStatusAttachment,
  createAttachment,
  deleteAttachment,
  getAllAttachment,
  getAttachmentById,
  updateAttachment,
} from "./attachment.thunk";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IAttachment } from "./attachment.model";

export interface IAttachmentInitialState extends IInitialState {
  attachments: IAttachment[];
  attachment?: IAttachment | any;
}

const initialState: IAttachmentInitialState = {
  status: EFetchStatus.IDLE,
  attachments: [],
  attachment: undefined,
  message: "",
  error: undefined,
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const attachmentSlice = createSlice({
  name: "attachment",
  initialState,
  reducers: {
    ...commonStaticReducers<IAttachmentInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getAllAttachment.fulfilled, (state, { payload }: PayloadAction<IResponse<IAttachment[]> | any>) => {
        if (payload.data) {
          state.attachments = payload.data.data;
          state.totalRecords = payload?.data?.total_elements;
          state.number_of_elements = payload?.data?.number_of_elements;
        }
      })
      .addCase(getAllAttachment.rejected, (state, { payload }: PayloadAction<IResponse<IAttachment[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(getAttachmentById.fulfilled, (state, { payload }: PayloadAction<IAttachment> | any) => {
        state.attachment = payload.data;
        state.loading = false;
      })
      .addCase(getAttachmentById.rejected, (state, { payload }: PayloadAction<IAttachment> | any) => {
        state.attachment = payload.data;
        state.message = transformPayloadErrors(payload?.errors);
        state.loading = true;
      });
    builder
      .addCase(createAttachment.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(createAttachment.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Tạo mới thành công ";
      })
      .addCase(createAttachment.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateAttachment.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateAttachment.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateAttachment.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(changeStatusAttachment.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changeStatusAttachment.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Thay đổi trạng thái thành công";
      })
      .addCase(changeStatusAttachment.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Delete tag
    builder
      .addCase(deleteAttachment.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(deleteAttachment.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Xóa thành công";
        state.businessActivities = state.attachments.filter((item) => String(item.id) !== payload);
      })
      .addCase(deleteAttachment.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
  },
});
export const { fetching, setFilter, resetStatus, resetMessageError } = attachmentSlice.actions;
export { attachmentSlice };
