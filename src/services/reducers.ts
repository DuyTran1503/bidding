import { combineReducers } from "@reduxjs/toolkit";

import { accountSlice } from "./store/account/account.slice";
import { appSlice } from "./store/app/app.slice";
import { authSlice } from "./store/auth/auth.slice";
import { roleSlice } from "./store/role/role.slice";
import { permissionSlice } from "./store/permission/permission.slice";
import { tagSlice } from "./store/tag/tag.slice";
import { biddingFieldSlice } from "./store/biddingField/biddingField.slice";
import { businessActivitySlice } from "./store/business-activity/business-activity.slice";
import { biddingTypeSlice } from "./store/biddingtype/biddingType.slice";

export const reducers = combineReducers({
  app: appSlice.reducer,
  auth: authSlice.reducer,
  account: accountSlice.reducer,
  role: roleSlice.reducer,
  permission: permissionSlice.reducer,
  biddingfield: biddingFieldSlice.reducer,
  biddingtype: biddingTypeSlice.reducer,
  tag: tagSlice.reducer,
  business: businessActivitySlice.reducer,
});

export type RootStateType = ReturnType<typeof reducers>;
