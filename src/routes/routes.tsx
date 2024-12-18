import Home from "@/Client/Home";
import Instruct from "@/Client/Instruct";
import Introduce from "@/Client/Introduce";
import News from "@/Client/News";
import Detail from "@/Client/News/Detail";
import Support from "@/Client/Supports";
import CreateSupport from "@/Client/Supports/Create";
import ClientLayout from "@/layouts/Client";
import DefaultLayout from "@/layouts/Default";
import AuthMiddleware from "@/middlewares/AuthMiddleware";
import GlobalMiddleware from "@/middlewares/GlobalMiddleware";
import GuestMiddleware from "@/middlewares/GuestMiddleware";
import NoPathMiddleware from "@/middlewares/NoPathMiddleware";
import ActivityLogs from "@/pages/ActivityLogs";
import Attachment from "@/pages/Attachment";
import Banners from "@/pages/Banners/Banners/Banners";
import BidBonds from "@/pages/BidBond";
import BiddingFields from "@/pages/BiddingFields/BiddingFields/BiddingFields";
import CreateBiddingField from "@/pages/BiddingFields/CreateBiddingField/CreateBiddingField";
import BiddingFieldDetail from "@/pages/BiddingFields/DetailBiddingField/DetailBiddingField";
import UpdateBiddingField from "@/pages/BiddingFields/UpdateBiddingField/UpdateBiddingField";
import BiddingHistorys from "@/pages/BiddingHistory/BiddingHistory/BiddingHistory";
import CreateBiddingHistory from "@/pages/BiddingHistory/CreateBiddingHistory/CreateBiddingHistory";
import UpdateBiddingHistory from "@/pages/BiddingHistory/UpdateBiddingHistory/UpdateBiddingHistory";
import BiddingResults from "@/pages/BiddingResults/BiddingResults/BiddingResults";
import DetailBiddingResult from "@/pages/BiddingResults/DetailBiddingResult";
import BiddingTypes from "@/pages/BiddingTypes/BiddingTypes/BiddingTypes";
import CreateBiddingType from "@/pages/BiddingTypes/CreateBiddingType/CreateBiddingType";
import UpdateBiddingType from "@/pages/BiddingTypes/UpdateBiddingType/UpdateBiddingType";
import BidDocument from "@/pages/BidDocument";
import CreateBidDocument from "@/pages/BidDocument/Create";
import DetailBidDocument from "@/pages/BidDocument/Detail";
import UpdateBidDocument from "@/pages/BidDocument/Update";
import BusinessActivities from "@/pages/BusinessActivities";
import CreateBusinessActivity from "@/pages/BusinessActivities/Create";
import UpdateBusinessActivity from "@/pages/BusinessActivities/Update";
import Components from "@/pages/Components/Components";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Employee from "@/pages/Employee";
import CreateEmployee from "@/pages/Employee/Create";
import DetailEmployee from "@/pages/Employee/Detail";
import UpdateEmployee from "@/pages/Employee/Update";
import Enterprise from "@/pages/Enterprise";
import CreateEnterprise from "@/pages/Enterprise/Create";
import DetailEnterprise from "@/pages/Enterprise/Detail";
import StatisticalEnterprise from "@/pages/Enterprise/Statistical";
import UpdateEnterprise from "@/pages/Enterprise/Update";
import NotFound from "@/pages/Errors/NotFound";
import Evaluates from "@/pages/Evaluates/Evaluates";
import EvaluationCriteria from "@/pages/EvaluationCriteria";
import FeedbackComplaints from "@/pages/FeedbackComplaint";
import EnterEmail from "@/pages/ForgotPassword/EnterEmail";
import NewPassword from "@/pages/ForgotPassword/NewPassword";
import Success from "@/pages/ForgotPassword/Success";
import FundingSources from "@/pages/FundingSource";
import CreateFundingSource from "@/pages/FundingSource/Create";
import DetailFundingSource from "@/pages/FundingSource/Detail";
import UpdateFundingSource from "@/pages/FundingSource/Update";
import Industry from "@/pages/Industry";
import CreateIndustry from "@/pages/Industry/Create";
import DetailIndustry from "@/pages/Industry/Detail";
import UpdateIndustry from "@/pages/Industry/Update";
import Instructs from "@/pages/Instructs";
import Introductions from "@/pages/Introductions";
import Login from "@/pages/Login/Login";
import Orders from "@/pages/Order/Orders/Orders";
import PostCatalogs from "@/pages/PostCatalogs/PostCatalogs";
import CreatePost from "@/pages/Posts/CreatePost/CreatePost";
import DetailPost from "@/pages/Posts/DetailPost/DetailPost";
import Posts from "@/pages/Posts/Posts/Posts";
import UpdatePost from "@/pages/Posts/UpdatePost/UpdatePost";
import ProcurementCategories from "@/pages/ProcurementCategories/ProcurementCategories";
import Profile from "@/pages/Profile";
import Update from "@/pages/Profile/Update";
import ProjectPage from "@/pages/Project";
import ProjectApproval from "@/pages/project-approval";
import ApproveProjectByStaff from "@/pages/project-approval/Approve";
import ApproveProject from "@/pages/Project/Approve";
import CreateProject from "@/pages/Project/Create";
import DetailProject from "@/pages/Project/Detail";
import Statistical from "@/pages/Project/Statistical/index";
import UpdateProject from "@/pages/Project/Update";
import QuestionsAnswers from "@/pages/Questions_Answers";
import CreateRole from "@/pages/Role/CreateRole/CreateRole";
import Roles from "@/pages/Role/Roles/Roles";
import UpdateRole from "@/pages/Role/UpdateRole/UpdateRole";
import SelectionMethods from "@/pages/SelectionMethods/SelectionMethods/SelectionMethods";
import CreateStaff from "@/pages/Staff/Create";
import DetailStaff from "@/pages/Staff/Detail";
import Staffs from "@/pages/Staff/Staffs";
import UpdateStaff from "@/pages/Staff/Update/UpdateStaff";
import CreateStatisticalReport from "@/pages/StatisticalReports/CreateStatisticalReport/CreateStatisticalReport";
import StatisticalReports from "@/pages/StatisticalReports/StatisticalReports/StatisticalReports";
import UpdateStatisticalReport from "@/pages/StatisticalReports/UpdateStatisticalReport/UpdateStatisticalReport";
import Supports from "@/pages/Supports/Supports/Supports";
import Systems from "@/pages/Systems/Systems";
import Tasks from "@/pages/Task/Tasks/Task";
import WorkProgresses from "@/pages/WorkProgresses";
import CreateWorkProgress from "@/pages/WorkProgresses/Create";
import DetailWorkProgress from "@/pages/WorkProgresses/Detail";
import UpdateWorkProgress from "@/pages/WorkProgresses/Update";
import { ReactNode } from "react";

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
        pages: [
          {
            path: "",
            layout: () => <ClientLayout />,
            pages: [
              {
                path: "/",
                element: () => <Home />,
              },
              {
                path: "introduce",
                element: () => <Introduce />,
              },
              {
                path: "news",
                pages: [
                  {
                    path: "/",
                    element: () => <News />,
                  },
                  {
                    path: "/:id",
                    element: () => <Detail />,
                  },
                ],
              },
              {
                path: "instruct",
                element: () => <Instruct />,
              },
              {
                path: "support",
                pages: [
                  {
                    path: "/",
                    element: () => <Support />,
                  },
                  {
                    path: "/create",
                    element: () => <CreateSupport />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "",
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
            path: "profile",
            pages: [
              {
                path: "/",
                element: () => <Profile />,
              },
              {
                path: "/update",
                element: () => <Update />,
              },
            ],
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
            path: "procurement-categories",
            pages: [
              {
                path: "/",
                element: () => <ProcurementCategories />,
              },
            ],
          },
          {
            path: "post-catalogs",
            pages: [
              {
                path: "/",
                element: () => <PostCatalogs />,
              },
            ],
          },
          {
            path: "evaluates",
            pages: [
              {
                path: "/",
                element: () => <Evaluates />,
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
              {
                path: "/statistical/:id",
                element: () => <StatisticalEnterprise />,
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
                path: "/detail/:id",
                element: () => <DetailBiddingResult />,
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
            path: "posts",
            pages: [
              {
                path: "/",
                element: () => <Posts />,
              },
              {
                path: "/create",
                element: () => <CreatePost />,
              },
              {
                path: "/update/:id",
                element: () => <UpdatePost />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailPost />,
              },
            ],
          },
          {
            path: "supports",
            pages: [
              {
                path: "/",
                element: () => <Supports />,
              },
            ],
          },
          {
            path: "attachment",
            // middleware: () => <PermissionMiddleware requiredPermissions={[EPermissions.LIST_PERMISSION]} />,
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
                path: "/statistical/:id",
                element: () => <Statistical />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailProject />,
              },
            ],
          },
          {
            path: "evaluation_criteria",
            pages: [
              {
                path: "/",
                element: () => <EvaluationCriteria />,
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
          {
            path: "employees",
            pages: [
              {
                path: "/",
                element: () => <Employee />,
              },
              {
                path: "/create",
                element: () => <CreateEmployee />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateEmployee />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailEmployee />,
              },
            ],
          },
          {
            path: "introductions",
            pages: [
              {
                path: "/",
                element: () => <Introductions />,
              },
              // {
              //   path: "/create",
              //   element: () => <CreateEmployee />,
              // },
              // {
              //   path: "/update/:id",
              //   element: () => <UpdateEmployee />,
              // },
              // {
              //   path: "/detail/:id",
              //   element: () => <DetailEmployee />,
              // },
            ],
          },
          {
            path: "instructs",
            pages: [
              {
                path: "/",
                element: () => <Instructs />,
              },
            ],
          },
          {
            path: "feedback-complaint",
            pages: [
              {
                path: "/",
                element: () => <FeedbackComplaints />,
              },
            ],
          },
          {
            path: "system",
            pages: [
              {
                path: "/",
                element: () => <Systems />,
              },
            ],
          },
          {
            path: "work-progresses",
            pages: [
              {
                path: "/",
                element: () => <WorkProgresses />,
              },
              {
                path: "/create",
                element: () => <CreateWorkProgress />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateWorkProgress />,
              },
              {
                path: "/detail/:id",
                element: () => <DetailWorkProgress />,
              },
            ],
          },
          {
            path: "project-approval",
            pages: [
              {
                path: "/",
                element: () => <ProjectApproval />,
              },
              {
                path: "/approve/:id",
                element: () => <ApproveProjectByStaff />,
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
  {
    path: "auth",
    pages: [
      {
        path: "/enter-email",
        element: () => <EnterEmail />,
      },
      {
        path: "/change-password",
        element: () => <NewPassword />,
      },
      {
        path: "/success",
        element: () => <Success />,
      },
    ],
  },
  {
    path: "*",
    element: () => <NotFound />,
  },
];
