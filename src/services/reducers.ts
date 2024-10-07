import { combineReducers } from "@reduxjs/toolkit";

import { accountSlice } from "./store/account/account.slice";
import { appSlice } from "./store/app/app.slice";
import { authSlice } from "./store/auth/auth.slice";
import { roleSlice } from "./store/role/role.slice";
import { permissionSlice } from "./store/permission/permission.slice";
import { biddingFieldSlice } from "./store/biddingField/biddingField.slice";
import { businessActivitySlice } from "./store/business-activity/business-activity.slice";
import { industrySlice } from "./store/industry/industry.slice";
import { enterpriseSlice } from "./store/enterprise/enterprise.slice";
import { statisticalReportSlice } from "./store/statisticalReport/statisticalReport.slice";
import { fundingSourceSlice } from "./store/funding_source/funding_source.slice";
import { biddingTypeSlice } from "./store/biddingType/biddingType.slice";
import { attachmentSlice } from "./store/attachment/attachment.slice";
import { bidDocumentSlice } from "./store/bid_document/bid_document.slice";
import { activityLogSlice } from "./store/activityLogs/activityLog.slice";
import { bidBondSlice } from "./store/bid_bond/bidBond.slice";
import { selectionMethodSlice } from "./store/selectionMethod/selectionMethod.slice";
import { projectSlice } from "./store/project/project.slice";
import { procurementSlice } from "./store/procurement/procurement.slice";
import { biddingResultSlice } from "./store/biddingResult/biddingResult.slice";
import { biddingHistorySlice } from "./store/biddingHistory/biddingHistory.slice";
import { bannerSlice } from "./store/banner/banner.slice";
import { procurementCategorieSlice } from "./store/procurementCategorie/procurementCategorie.slice";

export const reducers = combineReducers({
  app: appSlice.reducer,
  auth: authSlice.reducer,
  account: accountSlice.reducer,
  role: roleSlice.reducer,
  permission: permissionSlice.reducer,
  bidding_field: biddingFieldSlice.reducer,
  funding_source: fundingSourceSlice.reducer,
  bidding_type: biddingTypeSlice.reducer,
  business: businessActivitySlice.reducer,
  industry: industrySlice.reducer,
  enterprise: enterpriseSlice.reducer,
  statistical_report: statisticalReportSlice.reducer,
  attachment: attachmentSlice.reducer,
  bid_document: bidDocumentSlice.reducer,
  bid_bond: bidBondSlice.reducer,
  activity_log: activityLogSlice.reducer,
  selection_method: selectionMethodSlice.reducer,
  project: projectSlice.reducer,
  procurement: procurementSlice.reducer,
  bidding_history: biddingHistorySlice.reducer,
  bidding_result: biddingResultSlice.reducer,
  banner: bannerSlice.reducer,
  procurement_categorie: procurementCategorieSlice.reducer,
});

export type RootStateType = ReturnType<typeof reducers>;
