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
import DetailRole from "@/pages/Role/DetailRole/DetailRole";
import Permissions from "@/pages/Permission/Permissions/Permissions";
import PermissionMiddleware from "@/middlewares/PermissionMiddleware";
import { EPermissions } from "@/shared/enums/permissions";
import Tags from "@/pages/Tag/Tags/Tags";
import CreateTag from "@/pages/Tag/CreateTag/CreateTag";
import UpdateTag from "@/pages/Tag/UpdateTag/UpdateTag";
import CreatePermission from "@/pages/Permission/CreatePermission/CreatePermission";
import UpdatePermission from "@/pages/Permission/UpdatePermission/UpdatePermission";
import CreateBiddingField from "@/pages/BiddingFields/CreateBiddingField/CreateBiddingField";
import UpdateBiddingField from "@/pages/BiddingFields/UpdateBiddingField/UpdateBiddingField";
import BiddingFields from "@/pages/BiddingFields/BiddingFields/BiddingFields";
import Staffs from "@/pages/Staff/Staffs";
import CreateStaff from "@/pages/Staff/Create";
import DetailStaff from "@/pages/Staff/Detail";
import UpdateStaff from "@/pages/Staff/Update/UpdateStaff";
import BusinessActivities from "@/pages/BusinessActivities";
import CreateBusinessActivity from "@/pages/BusinessActivities/Create";
import UpdateBusinessActivity from "@/pages/BusinessActivities/Update";

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
              {
                path: "/detail/:id",
                element: () => <DetailRole />,
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
              }
            ],
          },
          {
            path: "tags",
            pages: [
              {
                path: "/",
                element: () => <Tags />,
              },
              {
                path: "/create",
                element: () => <CreateTag />,
              },
              {
                path: "/update/:id",
                element: () => <UpdateTag />,
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
            path: "permissions",
            middleware: () => <PermissionMiddleware requiredPermissions={[EPermissions.LIST_PERMISSION]} />,
            pages: [
              {
                path: "/",
                element: () => <Permissions />,
                middleware: () => <PermissionMiddleware requiredPermissions={[EPermissions.LIST_PERMISSION]} />,
              },
              {
                path: "/create",
                element: () => <CreatePermission />,
                middleware: () => <PermissionMiddleware requiredPermissions={[EPermissions.CREATE_PERMISSION]} />,
              },
              {
                path: "/update/:id",
                element: () => <UpdatePermission />,
                middleware: () => <PermissionMiddleware requiredPermissions={[EPermissions.UPDATE_PERMISSION]} />,
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
