import { combineReducers } from "@reduxjs/toolkit";

import { accountSlice } from "./store/account/account.slice";
import { activityLogSlice } from "./store/activityLogs/activityLog.slice";
import { appSlice } from "./store/app/app.slice";
import { attachmentSlice } from "./store/attachment/attachment.slice";
import { authSlice } from "./store/auth/auth.slice";
import { avgDifficultyByEnterpriseSlice } from "./store/avgDifficultyOfTheTask/avgDifficultyOfTheTask.slice";
import { bannerSlice } from "./store/banner/banner.slice";
import { bidBondSlice } from "./store/bid_bond/bidBond.slice";
import { bidDocumentSlice } from "./store/bid_document/bid_document.slice";
import { biddingFieldSlice } from "./store/biddingField/biddingField.slice";
import { biddingHistorySlice } from "./store/biddingHistory/biddingHistory.slice";
import { biddingResultSlice } from "./store/biddingResult/biddingResult.slice";
import { biddingTypeSlice } from "./store/biddingType/biddingType.slice";
import { businessActivitySlice } from "./store/business-activity/business-activity.slice";
import { chartSlice } from "./store/chart/chart.slice";
import { compareProjectSlice } from "./store/CompareProject/compareProject.slice";
import { enterpriseSlice } from "./store/enterprise/enterprise.slice";
import { evaluationSlice } from "./store/evaluation/evaluation.slice";
import { feedbackComplaintSlice } from "./store/feedback_complaint/feedback_complaint.slice";
import { fundingSourceSlice } from "./store/funding_source/funding_source.slice";
import { industrySlice } from "./store/industry/industry.slice";
import { insTructSlice } from "./store/instruct/instruct.slice";
import { introductionSlice } from "./store/introduction/introduction.slice";
import { permissionSlice } from "./store/permission/permission.slice";
import { postSlice } from "./store/post/post.slice";
import { postCatalogSlice } from "./store/postCatalog/postCatalog.slice";
import { procurementSlice } from "./store/procurement/procurement.slice";
import { procurementCategorieSlice } from "./store/procurementCategorie/procurementCategorie.slice";
import { projectSlice } from "./store/project/project.slice";
import { questionsAnswersSlice } from "./store/questions_answers/questions_answers.slice";
import { roleSlice } from "./store/role/role.slice";
import { selectionMethodSlice } from "./store/selectionMethod/selectionMethod.slice";
import { statisticalReportSlice } from "./store/statisticalReport/statisticalReport.slice";
import { supportSlice } from "./store/support/support.slice";
import { tenderNoticeSlice } from "./store/tenderNotice/tenderNotice.slice";

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
  post_catalog: postCatalogSlice.reducer,
  post: postSlice.reducer,
  support: supportSlice.reducer,
  tender_notice: tenderNoticeSlice.reducer,
  evaluation: evaluationSlice.reducer,
  feedback_complaint: feedbackComplaintSlice.reducer,
  questions_answers: questionsAnswersSlice.reducer,
  chart: chartSlice.reducer,
  compareproject: compareProjectSlice.reducer,
  introduction: introductionSlice.reducer,
  instruct: insTructSlice.reducer,
  avgDifficultyByEnterprise: avgDifficultyByEnterpriseSlice.reducer,
});

export type RootStateType = ReturnType<typeof reducers>;
