import { combineReducers } from "@reduxjs/toolkit";

import { accountSlice } from "./store/account/account.slice";
import { appSlice } from "./store/app/app.slice";
import { authSlice } from "./store/auth/auth.slice";
import { roleSlice } from "./store/role/role.slice";
import { permissionSlice } from "./store/permission/permission.slice";
import { tagSlice } from "./store/tag/tag.slice";
import { fundingSourceSlice } from "./store/funding_source/funding_source.slice";
import { fieldofactivitySlice } from "./store/field_of_activity/field_of_activity.slice";

export const reducers = combineReducers({
  app: appSlice.reducer,
  auth: authSlice.reducer,
  account: accountSlice.reducer,
  role: roleSlice.reducer,
  permission: permissionSlice.reducer,
  tag: tagSlice.reducer,
  fundingsource: fundingSourceSlice.reducer,
  fieldofactivity: fieldofactivitySlice.reducer
});

export type RootStateType = ReturnType<typeof reducers>;
