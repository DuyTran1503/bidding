import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { commonStaticReducers } from "@/services/shared";
import { IError } from "@/shared/interface/error";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { getEditProfile, updateEditProfile } from "./profile.thunk";
import { IEditProfile } from "./profile.model";

export interface IEditProfileInitialState extends IInitialState {
  editProfiles: IEditProfile | any;
}

const initialState: IEditProfileInitialState = {
  status: EFetchStatus.IDLE,
  editProfiles: undefined,
  message: "",
  error: undefined,
  filter: {
    page: 1,
    size: 10,
  },
  totalRecords: 0,
  number_of_elements: 0,
};

const editProfileSlice = createSlice({
  name: "edit_profile",
  initialState,
  reducers: {
    ...commonStaticReducers<IEditProfileInitialState>(),
    fetching(state) {
      state.loading = true;
    },
    resetMessageError(state) {
      state.message = "";
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getEditProfile.fulfilled, (state, { payload }: PayloadAction<IResponse<IEditProfile[]> | any>) => {
        if (payload) {
          state.editProfiles = payload?.data;
        }
      })
      .addCase(getEditProfile.rejected, (state, { payload }: PayloadAction<IResponse<IEditProfile[]> | any>) => {
        state.message = transformPayloadErrors(payload?.errors);
      });
    builder
      .addCase(updateEditProfile.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(updateEditProfile.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Cập nhật thành công";
      })
      .addCase(updateEditProfile.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors || payload?.message);
      });
  },
});
export const { fetching, setFilter, resetStatus, resetMessageError } = editProfileSlice.actions;
export { editProfileSlice };
