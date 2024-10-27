import { ReactNode } from "react";
import DefaultLayout from "@/layouts/Default";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Components from "@/pages/Components/Components";
import NoPathMiddleware from "@/middlewares/NoPathMiddleware";
import Login from "@/pages/Login/Login";
import GuestMiddleware from "@/middlewares/GuestMiddleware";
import AuthMiddleware from "@/middlewares/AuthMiddleware";
import GlobalMiddleware from "@/middlewares/GlobalMiddleware";
import Orders from "@/pages/Order/Orders/Orders";
import Roles from "@/pages/Role/Roles/Roles";
import CreateRole from "@/pages/Role/CreateRole/CreateRole";
import UpdateRole from "@/pages/Role/UpdateRole/UpdateRole";
import FundingSources from "@/pages/FundingSource";
import CreateFundingSource from "@/pages/FundingSource/Create";
import BusinessActivities from "@/pages/BusinessActivities";
import CreateBusinessActivity from "@/pages/BusinessActivities/Create";
import UpdateBusinessActivity from "@/pages/BusinessActivities/Update";
import Industry from "@/pages/Industry";
import CreateIndustry from "@/pages/Industry/Create";
import UpdateIndustry from "@/pages/Industry/Update";
import DetailIndustry from "@/pages/Industry/Detail";
import Enterprise from "@/pages/Enterprise";
import CreateEnterprise from "@/pages/Enterprise/Create";
import UpdateEnterprise from "@/pages/Enterprise/Update";
import StatisticalReports from "@/pages/StatisticalReports/StatisticalReports/StatisticalReports";
import CreateStatisticalReport from "@/pages/StatisticalReports/CreateStatisticalReport/CreateStatisticalReport";
import UpdateStatisticalReport from "@/pages/StatisticalReports/UpdateStatisticalReport/UpdateStatisticalReport";
import UpdateBiddingType from "@/pages/BiddingTypes/UpdateBiddingType/UpdateBiddingType";
import CreateBiddingType from "@/pages/BiddingTypes/CreateBiddingType/CreateBiddingType";
import BiddingTypes from "@/pages/BiddingTypes/BiddingTypes/BiddingTypes";
import BiddingFieldDetail from "@/pages/BiddingFields/DetailBiddingField/DetailBiddingField";
import UpdateBiddingField from "@/pages/BiddingFields/UpdateBiddingField/UpdateBiddingField";
import CreateBiddingField from "@/pages/BiddingFields/CreateBiddingField/CreateBiddingField";
import BiddingFields from "@/pages/BiddingFields/BiddingFields/BiddingFields";
import DetailStaff from "@/pages/Staff/Detail";
import UpdateStaff from "@/pages/Staff/Update/UpdateStaff";
import CreateStaff from "@/pages/Staff/Create";
import Staffs from "@/pages/Staff/Staffs";
import UpdateFundingSource from "@/pages/FundingSource/Update";
import DetailFundingSource from "@/pages/FundingSource/Detail";
import Attachment from "@/pages/Attachment";
import BidDocument from "@/pages/BidDocument";
import CreateBidDocument from "@/pages/BidDocument/Create";

import DetailBidDocument from "@/pages/BidDocument/Detail";
import UpdateBidDocument from "@/pages/BidDocument/Update";
import DetailEnterprise from "@/pages/Enterprise/Detail";
import BiddingHistorys from "@/pages/BiddingHistory/BiddingHistory/BiddingHistory";
import CreateBiddingHistory from "@/pages/BiddingHistory/CreateBiddingHistory/CreateBiddingHistory";
import UpdateBiddingHistory from "@/pages/BiddingHistory/UpdateBiddingHistory/UpdateBiddingHistory";
import PermissionMiddleware from "@/middlewares/PermissionMiddleware";
import { EPermissions } from "@/shared/enums/permissions";
import ActivityLogs from "@/pages/ActivityLogs";
import SelectionMethods from "@/pages/SelectionMethods/SelectionMethods/SelectionMethods";
import ProjectPage from "@/pages/Project";
import CreateProject from "@/pages/Project/Create";
import UpdateProject from "@/pages/Project/Update";
import ApproveProject from "@/pages/Project/Approve";
import BiddingResults from "@/pages/BiddingResults/BiddingResults/BiddingResults";
import CreateBiddingResult from "@/pages/BiddingResults/CreateBiddingResult/CreateBiddingResult";
import UpdateBiddingResult from "@/pages/BiddingResults/UpdateBiddingResult/UpdateBiddingResult";
import Banners from "@/pages/Banners/Banners/Banners";
import DetailProject from "@/pages/Project/Detail";
import BidBonds from "@/pages/BidBond";
import EvaluationCriteria from "@/pages/EvaluationCriteria";
import Tasks from "@/pages/Task/Tasks/Task";
import QuestionsAnswers from "@/pages/Questions_Answers";

export interface IRoute {
  path: string;
  layout?: () => ReactNode;
  middleware?: () => ReactNode;
  element?: () => ReactNode;
  pages?: IRoute[];
}

export const routes: IRoute[] = [
  {
    path: "/",
    middleware: () => <GlobalMiddleware />,
    pages: [
      {
        path: "/",
        middleware: () => <AuthMiddleware />,
        layout: () => <DefaultLayout />,
        pages: [
          {
            path: "/",
            middleware: () => <NoPathMiddleware />,
          },
          {
            path: "dashboard",
            element: () => <Dashboard />,
          },
          {
            path: "staffs",
            pages: [
              {
                path: "/",
                element: () => <Staffs />,
              },
              {
                path: "/create",
                element: () => <CreateStaff />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateStaff />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailStaff />,
              },
            ],
          },
          {
            path: "bidding-fields",
            pages: [
              {
                path: "/",
                element: () => <BiddingFields />,
              },
              {
                path: "/create",
                element: () => <CreateBiddingField />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateBiddingField />,
              },
              {
                path: "/detail/:id",
                element: () => <BiddingFieldDetail />,
              },
            ],
          },
          {
            path: "bidding-types",
            pages: [
              {
                path: "/",
                element: () => <BiddingTypes />,
              },
              {
                path: "/create",
                element: () => <CreateBiddingType />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateBiddingType />,
              },
            ],
          },
          {
            path: "selection-methods",
            pages: [
              {
                path: "/",
                element: () => <SelectionMethods />,
              },
            ],
          },
          {
            path: "orders",
            element: () => <Orders />,
          },
          {
            path: "components",
            element: () => <Components />,
          },
          {
            path: "roles",
            pages: [
              {
                path: "/",
                element: () => <Roles />,
              },
              {
                path: "/create",
                element: () => <CreateRole />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateRole />,
              },
            ],
          },
          {
            path: "business-activity",
            pages: [
              {
                path: "/",
                element: () => <BusinessActivities />,
              },
              {
                path: "/create",
                element: () => <CreateBusinessActivity />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateBusinessActivity />,
              },
            ],
          },
          {
            path: "funding-sources",
            pages: [
              {
                path: "/",
                element: () => <FundingSources />,
              },
              {
                path: "/create",
                element: () => <CreateFundingSource />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateFundingSource />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailFundingSource />,
              },
            ],
          },
          {
            path: "industry",
            pages: [
              {
                path: "/",
                element: () => <Industry />,
              },
              {
                path: "/create",
                element: () => <CreateIndustry />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateIndustry />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailIndustry />,
              },
            ],
          },
          {
            path: "activity-logs",
            pages: [
              {
                path: "/",
                element: () => <ActivityLogs />,
              },
              // {
              //   path: "/detail/:id",
              //   element: () => <DetailActi />,
              // },
            ],
          },
          {
            path: "enterprise",
            pages: [
              {
                path: "/",
                element: () => <Enterprise />,
              },
              {
                path: "/create",
                element: () => <CreateEnterprise />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateEnterprise />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailEnterprise />,
              },
            ],
          },
          {
            path: "statistical-reports",
            pages: [
              {
                path: "/",
                element: () => <StatisticalReports />,
              },
              {
                path: "/create",
                element: () => <CreateStatisticalReport />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateStatisticalReport />,
              },
            ],
          },
          {
            path: "bidding-historys",
            pages: [
              {
                path: "/",
                element: () => <BiddingHistorys />,
              },
              {
                path: "/create",
                element: () => <CreateBiddingHistory />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateBiddingHistory />,
              },
            ],
          },
          {
            path: "bidding-results",
            pages: [
              {
                path: "/",
                element: () => <BiddingResults />,
              },
              {
                path: "/create",
                element: () => <CreateBiddingResult />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateBiddingResult />,
              },
            ],
          },
          {
            path: "banners",
            pages: [
              {
                path: "/",
                element: () => <Banners />,
              },
            ],
          },
          {
            path: "permissions",
            middleware: () => <PermissionMiddleware requiredPermissions={[EPermissions.LIST_PERMISSION]} />,
            pages: [
              {
                path: "/",
                element: () => <Attachment />,
              },
            ],
          },
          {
            path: "bid-document",
            pages: [
              {
                path: "/",
                element: () => <BidDocument />,
              },
              {
                path: "/create",
                element: () => <CreateBidDocument />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateBidDocument />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailBidDocument />,
              },
            ],
          },
          {
            path: "bid-bond",
            pages: [
              {
                path: "/",
                element: () => <BidBonds />,
              },
              {
                path: "/create",
                element: () => <CreateBidDocument />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateBidDocument />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailBidDocument />,
              },
            ],
          },
          {
            path: "project",
            pages: [
              {
                path: "/",
                element: () => <ProjectPage />,
              },
              {
                path: "/create",
                element: () => <CreateProject />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateProject />,
              },
              {
                path: "/approve/:id",
                element: () => <ApproveProject />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailProject />,
              },
            ],
          },
          {
            path: "task",
            pages: [
              {
                path: "/",
                element: () => <Tasks />,
              },
            ],
          },
          {
            path: "questions-answers",
            pages: [
              {
                path: "/",
                element: () => <QuestionsAnswers />,
              },
            ],
          },
        ],
      },
      {
        path: "auth",
        middleware: () => <GuestMiddleware />,
        pages: [
          {
            path: "login",
            element: () => <Login />,
          },
        ],
      },
    ],
  },
];
