import lodash from "lodash";
import { PropsWithChildren, useState } from "react";
import { IconType } from "react-icons";
import { useLocation, useNavigate } from "react-router-dom";

import MenuItem from "./MenuItem";

// Icons
import { IoPieChartOutline, IoSettingsOutline } from "react-icons/io5";

// Images
import logo from "@/assets/images/logo.png";
import { RxComponent1 } from "react-icons/rx";
import { EPermissions } from "@/shared/enums/permissions";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { checkPermission } from "@/helpers/checkPermission";
import { MdOutlineFactory } from "react-icons/md";

export interface IMenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: {
    component: IconType;
    className?: string;
  };
  items?: Pick<IMenuItem, Exclude<keyof IMenuItem, "items" | "icon">>[];
  onClick?: () => void;
  permissions?: EPermissions[] | EPermissions;
}

const Sidebar = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();

  const { state } = useArchive<IAuthInitialState>("auth");

  const [activeMenuItemId, setActiveMenuItemId] = useState<string | null>();
  const [openingMenuId, setOpeningMenuId] = useState<string | null>();
  const { pathname } = useLocation();
  const activePath = lodash.last(lodash.remove(pathname.split("/")));
  const menuItems: IMenuItem[] = [
    {
      id: "1",
      label: "Bảng điều khiển",
      path: "dashboard",
      icon: { component: IoPieChartOutline },
    },
    {
      id: "3",
      label: "Doanh nghiệp",
      icon: { component: MdOutlineFactory },
      items: [
        {
          id: "3.1",
          label: "Doanh nghiệp",
          path: "enterprise",
          permissions: EPermissions.LIST_BUSINESS_ACTIVITY_TYPE,
        },
        {
          id: "3.2",
          label: "Loại hình kinh doanh",
          path: "business-activity",
          permissions: EPermissions.LIST_BUSINESS_ACTIVITY_TYPE,
        },
        {
          id: "3.2",
          label: "Lĩnh vực đấu thầu",
          path: "bidding-fields",
          permissions: EPermissions.LIST_BIDDING_FIELD,
        },
        {
          id: "3.3",
          label: "Loại hình đấu thầu",
          path: "bidding-types",
          permissions: EPermissions.LIST_BIDDING_TYPE,
        },
        {
          id: "3.4",
          label: "Ngành kinh doanh",
          path: "industry",
          permissions: EPermissions.LIST_INDUSTRY,
        },
        {
          id: "3.5",
          label: "Nguồn tài trợ",
          path: "funding-sources",
          permissions: EPermissions.LIST_FUNDING_SOURCE,
        },
        {
          id: "3.6",
          label: "Nhật ký hoạt động",
          path: "activity-logs",
          permissions: EPermissions.LIST_ACTIVITYLOG,
        },
        {
          id: "3.6",
          label: "Hình thức lựa chọn Nhà thầu",
          path: "selection-methods",
          permissions: EPermissions.LIST_SELECTION_METHOD,
        },
      ],
    },
    {
      id: "4",
      label: "Dự án",
      icon: { component: MdOutlineFactory },
      items: [
        {
          id: "4.1",
          label: "Tài liệu đính kèm",
          path: "attachment",
          permissions: EPermissions.LIST_ATTACHMENT,
        },
        {
          id: "4.2",
          label: "Hồ sơ mời thầu",
          path: "bid-document",
          permissions: EPermissions.LIST_BID_DOCUMENT,
        },
        {
          id: "4.3",
          label: "Dự án",
          path: "project",
          permissions: EPermissions.LIST_BID_DOCUMENT,
        },
        {
          id: "4.4",
          label: "Bảo lãnh dự thầu",
          path: "bid-bond",
          // permissions: EPermissions.LIST_BID_BOND,
        },
        {
          id: "4.5",
          label: "Tiêu chí đánh giá",
          path: "evaluation-criteria",
          permissions: EPermissions.LIST_EVALUATION,
        },
      ],
    },
    {
      id: "5",
      label: "Hệ thống",
      icon: { component: IoSettingsOutline },
      items: [
        {
          id: "5.1",
          label: "Vai trò",
          path: "roles",
          permissions: EPermissions.LIST_ROLE,
        },
        {
          id: "5.2",
          label: "Nhân viên",
          path: "staffs",
          permissions: EPermissions.LIST_STAFF,
        },
        {
          id: "5.3",
          label: "Tags",
          path: "tags",
          permissions: EPermissions.LIST_TAG,
        },
        {
          id: "5.4",
          label: "Báo cáo thống kê",
          path: "statistical_reports",
          permissions: EPermissions.LIST_STATISTICAL_REPORT,
        },
        {
          id: "4.5",
          label: "Lịch sử đấu thầu",
          path: "bidding-historys",
          permissions: EPermissions.LIST_BIDDING_TYPE,
        },
        {
          id: "4.6",
          label: "Kết quả đấu thầu",
          path: "bidding-results",
          permissions: EPermissions.LIST_BIDDING_TYPE,
        },
        {
          id: "4.7",
          label: "Banner",
          path: "banners",
          permissions: EPermissions.LIST_BANNER,
        },
        {
          id: "4.8",
          label: "Câu hỏi/ Câu trả lời",
          path: "questions-answers",
          // permissions: EPermissions.LIST_QUESTIONS_ANSWERS,
        },
        {
          id: "4.9",
          label: "Phản hồi và Khiếu nại",
          path: "feedback-complaint",
          // permissions: EPermissions.LIST_FEEDBACK_COMPLAINT,
        },
      ],
    },
    {
      id: "5",
      label: "Components",
      path: "components",
      icon: { component: RxComponent1 },
    },
  ];

  return (
    <>
      {/* Page parent */}
      <div className="flex h-dvh select-none bg-gray-25">
        <aside className="fixed bottom-0 left-0 top-0 z-40 flex w-[264px] flex-col bg-white">
          {/* Logo */}
          <div className="flex cursor-pointer items-center gap-3 px-5 py-6" onClick={() => navigate("/")}>
            <img src={logo} alt="" className="h-[34px] w-[34px]" />
            <div className="display-m-semibold">Septenary Solution</div>
          </div>

          {/* Navbar */}
          <nav className="no-scrollbar mb-2 flex grow flex-col gap-2 overflow-y-scroll pt-4">
            {menuItems.map((item, index) => {
              return (
                <div key={index} className="flex flex-col gap-2">
                  {/* Parent Item */}
                  {checkPermission(state.profile?.permissions, item.permissions) && (
                    <MenuItem
                      onClick={() => {
                        setActiveMenuItemId(activeMenuItemId === item.id ? null : item.id);
                        setOpeningMenuId(openingMenuId === item.id ? null : item.id);
                      }}
                      {...item}
                      isOpen={item.id === openingMenuId}
                      hasChildren={!!item.items?.length}
                      isActive={!!item.path && item.path === activePath}
                      isChildActive={item.items?.some((i) => !!i.path && i.path === activePath)}
                    />
                  )}
                  {/* Child Item */}
                  {activeMenuItemId === item.id && item.items?.some((child) => checkPermission(state.profile?.permissions, child.permissions)) && (
                    <div className="flex flex-col gap-2">
                      {item.items?.map((child, index) => {
                        return (
                          checkPermission(state.profile?.permissions, child.permissions) && (
                            <MenuItem key={index} {...child} isChild isActive={child.path === activePath} />
                          )
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="ml-[264px] flex grow flex-col gap-6 overflow-y-scroll p-6">{children}</main>
      </div>
    </>
  );
};

export default Sidebar;
