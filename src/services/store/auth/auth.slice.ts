import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { changePassword, getProfile, login, logout, refreshToken, sendMailForgotPassword } from "./auth.thunk";
import { ILoginResponseData, IUserProfile } from "./auth.model";
import { transformPayloadErrors } from "@/shared/utils/common/function";
import { IError } from "@/shared/interface/error";

export interface IAuthInitialState extends Partial<IInitialState> {
  isLogin: boolean;
  profile: IUserProfile | null;
  loginTime: number;
}

const initialState: IAuthInitialState = {
  isLogin: false,
  profile: null,
  loginTime: 0,
  status: EFetchStatus.IDLE,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = EFetchStatus.IDLE;
      state.message = "";
    },
  },

  extraReducers(builder) {
    // ? Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(getProfile.fulfilled, (state, { payload }: PayloadAction<IResponse<IUserProfile>>) => {
        state.profile = payload.data;
        state.isLogin = true;
        state.status = EFetchStatus.FULFILLED;
      })
      .addCase(getProfile.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
      });
    // ? Login
    builder
      .addCase(login.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(login.fulfilled, (state, { payload }: PayloadAction<IResponse<ILoginResponseData>>) => {
        localStorage.setItem("accessToken", JSON.stringify(payload.data?.access_token));
        localStorage.setItem("refreshToken", JSON.stringify(payload.data?.refresh_token));
        localStorage.setItem("expiresIn", JSON.stringify(payload.data?.expires_in));
        state.loginTime = +payload.data?.expires_in;
        state.status = EFetchStatus.FULFILLED;
      })
      .addCase(login.rejected, (state, { payload }: PayloadAction<any>) => {
        // state.message = payload?.message;
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors || payload?.message || "Tài khoản mật khẩu không chính xác");
      });
    // ? Gửi yêu cầu đổi mật khẩu
    builder
      .addCase(sendMailForgotPassword.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(sendMailForgotPassword.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Gửi yêu cầu thành công";
      })
      .addCase(sendMailForgotPassword.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Mật khẩu mới
    builder
      .addCase(changePassword.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED;
        state.message = "Gửi yêu cầu thành công";
      })
      .addCase(changePassword.rejected, (state, { payload }: PayloadAction<IError | any>) => {
        state.status = EFetchStatus.REJECTED;
        state.message = transformPayloadErrors(payload?.errors);
      });
    // ? Logout
    builder
      .addCase(logout.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresIn");
        state.isLogin = false;
        state.loginTime = 0;
        state.status = EFetchStatus.FULFILLED;
      })
      .addCase(logout.rejected, (state, { payload }: PayloadAction<any>) => {
        state.message = payload?.message;
        state.status = EFetchStatus.REJECTED;
      });
    builder
      .addCase(refreshToken.pending, (state) => {
        state.status = EFetchStatus.PENDING;
      })
      .addCase(refreshToken.fulfilled, (state, { payload }: PayloadAction<IResponse<any>>) => {
        localStorage.setItem("accessToken", JSON.stringify(payload.data?.access_token));
        localStorage.setItem("expiresIn", JSON.stringify(payload.data?.expires_in));
        state.loginTime = +payload.data?.expires_in;
        state.status = EFetchStatus.FULFILLED;
      })
      .addCase(refreshToken.rejected, (state, { payload }: PayloadAction<any>) => {
        state.message = payload?.message;
        state.status = EFetchStatus.REJECTED;
      });
  },
});

export const { resetStatus } = authSlice.actions;
export { authSlice };
