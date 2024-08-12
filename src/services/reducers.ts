import { combineReducers } from "@reduxjs/toolkit";

import { accountSlice } from "./store/account/account.slice";
import { appSlice } from "./store/app/app.slice";
import { authSlice } from "./store/auth/auth.slice";
import { roleSlice } from "./store/role/role.slice";
import { permissionSlice } from "./store/permission/permission.slice";
import { tagSlice } from "./store/tag/tag.slice";
<<<<<<< HEAD
import { fundingSourceSlice } from "./store/funding_source/funding_source.slice";
=======
import { biddingFieldSlice } from "./store/biddingField/biddingField.slice";
import { businessActivitySlice } from "./store/business-activity/business-activity.slice";
import { industrySlice } from "./store/industry/industry.slice";
import { enterpriseSlice } from "./store/enterprise/enterprise.slice";
import { biddingTypeSlice } from "./store/biddingType/biddingType.slice";
import { statisticalReportSlice } from "./store/statisticalReport/statisticalReport.slice";
>>>>>>> 0c6d7c227de676031411e8cba8334225f850cac8

export const reducers = combineReducers({
  app: appSlice.reducer,
  auth: authSlice.reducer,
  account: accountSlice.reducer,
  role: roleSlice.reducer,
  permission: permissionSlice.reducer,
  bidding_field: biddingFieldSlice.reducer,
  bidding_type: biddingTypeSlice.reducer,
  tag: tagSlice.reducer,
<<<<<<< HEAD
  fundingsource: fundingSourceSlice.reducer
=======
  business: businessActivitySlice.reducer,
  industry: industrySlice.reducer,
  enterprise: enterpriseSlice.reducer,
  statistical_report: statisticalReportSlice.reducer,
>>>>>>> 0c6d7c227de676031411e8cba8334225f850cac8
});

export type RootStateType = ReturnType<typeof reducers>;
