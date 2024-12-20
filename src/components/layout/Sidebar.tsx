/* eslint-disable max-len */
import lodash from "lodash";
import { PropsWithChildren, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { useLocation, useNavigate } from "react-router-dom";

import MenuItem from "./MenuItem";

// Keep all existing imports...
import {
  IoBookmarkOutline,
  IoBriefcaseOutline,
  IoBusinessOutline,
  IoClose,
  IoFileTrayFullOutline,
  IoHeadsetOutline,
  IoHome,
  IoMenu,
  IoPodiumOutline,
  IoReceiptOutline,
  IoSettingsOutline,
  IoTimerOutline,
} from "react-icons/io5";

import { checkPermission } from "@/helpers/checkPermission";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { ISystemInitialState } from "@/services/store/system/system.slice";
import { getSystem } from "@/services/store/system/system.thunk";
import { EPermissions } from "@/shared/enums/permissions";
import { MdOutlineCreditScore } from "react-icons/md";

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
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const { state: stateSystem, dispatch } = useArchive<ISystemInitialState>("system");

  useEffect(() => {
    dispatch(getSystem({}));
  }, []);

  // Helper function to check if menu item should be visible
  const shouldShowMenuItem = (item: IMenuItem) => {
    // For items with no children, check its own permissions
    if (!item.items?.length) {
      return checkPermission(state.profile?.permissions, item.permissions);
    }

    // For items with children, check if at least one child has valid permissions
    return item.items.some((child) => checkPermission(state.profile?.permissions, child.permissions));
  };

  const menuItems: IMenuItem[] = [
    {
      id: "1",
      label: "Trang chủ",
      path: "dashboard",
      icon: { component: IoHome },
      permissions: EPermissions.DASHBOARD,
    },
    {
      id: "2",
      label: "Dự án",
      icon: { component: IoFileTrayFullOutline },
      items: [
        {
          id: "2.1",
          label: "Dự án",
          path: "project",
          permissions: EPermissions.LIST_PROJECT,
        },
        {
          id: "2.2",
          label: "Tài liệu đính kèm",
          path: "attachment",
          permissions: EPermissions.LIST_ATTACHMENT,
        },
        {
          id: "2.3",
          label: "Hồ sơ dự thầu",
          path: "bid-document",
          permissions: EPermissions.LIST_BID_DOCUMENT,
        },
        {
          id: "2.4",
          label: "Bảo lãnh dự thầu",
          path: "bid-bond",
          permissions: EPermissions.LIST_BID_BOND,
        },
        {
          id: "2.5",
          label: "Tiêu chí đánh giá",
          path: "evaluation_criteria",
          permissions: EPermissions.LIST_EVALUATION,
        },
        {
          id: "2.6",
          label: "Nguồn tài trợ",
          path: "funding-sources",
          permissions: EPermissions.LIST_FUNDING_SOURCE,
        },
        {
          id: "2.7",
          label: "Tiến độ dự án",
          path: "work-progresses",
          permissions: EPermissions.LIST_EVALUATION,
        },
      ],
    },
    {
      id: "3",
      label: "Doanh nghiệp",
      icon: { component: IoBusinessOutline },
      items: [
        {
          id: "3.1",
          label: "Doanh nghiệp",
          path: "enterprise",
          permissions: EPermissions.LIST_ENTERPRISE,
        },
        {
          id: "3.2",
          label: "Nhân viên",
          path: "employees",
          permissions: EPermissions.LIST_EMPLOYEE,
        },
        {
          id: "3.3",
          label: "Công việc",
          path: "task",
          permissions: EPermissions.LIST_TASK,
        },
      ],
    },
    {
      id: "15",
      label: "Phê duyệt dự án",
      path: "project-approval",
      icon: { component: MdOutlineCreditScore },
      permissions: EPermissions.APPROVE_PROJECT,
    },
    {
      id: "4",
      label: "Ngành nghề",
      icon: { component: IoPodiumOutline },
      items: [
        {
          id: "4.1",
          label: "Loại hình kinh doanh",
          path: "business-activity",
          permissions: EPermissions.LIST_BUSINESS_ACTIVITY_TYPE,
        },
        {
          id: "4.2",
          label: "Ngành kinh doanh",
          path: "industry",
          permissions: EPermissions.LIST_INDUSTRY,
        },
      ],
    },
    {
      id: "5",
      icon: { component: IoBookmarkOutline },
      label: "Hình thức lựa chọn nhà thầu",
      path: "selection-methods",
      permissions: EPermissions.LIST_SELECTION_METHOD,
    },
    {
      id: "6",
      icon: { component: IoBriefcaseOutline },
      label: "Loại hình mua sắm công",
      path: "procurement-categories",
      permissions: EPermissions.LIST_PROCUREMENT_CATEGORY,
    },
    {
      id: "7",
      label: "Lịch sử đấu thầu",
      icon: { component: IoTimerOutline },
      items: [
        {
          id: "7.1",
          label: "Kết quả đấu thầu",
          path: "bidding-results",
          permissions: EPermissions.LIST_BIDDING_RESULT,
        },
        {
          id: "7.2",
          label: "Đánh giá kết quả dự án",
          path: "evaluates",
          permissions: EPermissions.LIST_EVALUATE,
        },
      ],
    },
    {
      id: "8",
      label: "Hệ thống",
      icon: { component: IoSettingsOutline },
      items: [
        {
          id: "8.1",
          label: "Vai trò",
          path: "roles",
          permissions: EPermissions.LIST_ROLE,
        },
        {
          id: "8.2",
          label: "Nhân viên",
          path: "staffs",
          permissions: EPermissions.LIST_STAFF,
        },
        {
          id: "8.3",
          label: "Tags",
          path: "tags",
          permissions: EPermissions.LIST_TAG,
        },
        {
          id: "8.4",
          label: "Báo cáo thống kê",
          path: "statistical_reports",
          permissions: EPermissions.LIST_STATISTICAL_REPORT,
        },
        {
          id: "8.5",
          label: "Nhật ký hoạt động",
          path: "activity-logs",
          permissions: EPermissions.LIST_ACTIVITY_LOG,
        },
        {
          id: "8.6",
          label: "Banner",
          path: "banners",
          permissions: EPermissions.LIST_BANNER,
        },
        {
          id: "8.7",
          label: "Giới thiệu",
          path: "introductions",
          permissions: EPermissions.LIST_INTRODUCTION,
        },
        {
          id: "8.8",
          label: "Hướng dẫn",
          path: "instructs",
          permissions: EPermissions.LIST_INDUSTRY,
        },
        {
          id: "8.9",
          label: "Cập nhập hệ thống",
          path: "system",
          permissions: EPermissions.LIST_SYSTEM,
        },
      ],
    },
    {
      id: "9",
      label: "Tin tức",
      icon: { component: IoReceiptOutline },
      items: [
        {
          id: "9.1",
          label: "Danh mục bài viết",
          path: "post-catalogs",
          permissions: EPermissions.LIST_CATALOG,
        },
        {
          id: "9.2",
          label: "Bài viết",
          path: "posts",
          permissions: EPermissions.LIST_POST,
        },
      ],
    },
    {
      id: "10.1",
      label: "Hỗ trợ",
      path: "supports",
      permissions: EPermissions.LIST_SUPPORT,
      icon: { component: IoHeadsetOutline },
    },
    // {
    //   id: "10",
    //   label: "Phản hồi và khiếu nại",
    //   icon: { component: IoChatbubblesOutline },
    //   path: "feedback-complaint",
    //   permissions: EPermissions.LIST_FEEDBACK_COMPLAINT,
    // },

    // {
    //   id: "14",
    //   label: "Components",
    //   path: "components",
    //   icon: { component: RxComponent1 },
    // },
  ];

  return (
    <>
      <button
        className="fixed left-6 top-7 z-50 block rounded bg-blue-200 p-2 text-white hover:bg-blue-500 md:hidden"
        onClick={() => setSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? <IoClose size={24} /> : <IoMenu size={24} />}
      </button>

      <div className="flex h-dvh select-none bg-gray-25">
        <div
          className={`fixed bottom-0 left-0 top-0 z-40 flex w-[264px] flex-col bg-white transition-transform duration-300 md:translate-x-0 ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex cursor-pointer items-center gap-x-3 px-5 py-4 uppercase" onClick={() => navigate("/dashboard")}>
            <img src={stateSystem.system?.logo} alt={stateSystem.system?.name} className="w-20" />
            <div className="text-xl font-semibold">{stateSystem.system?.name}</div>
          </div>

          <nav className="no-scrollbar mb-2 flex grow flex-col gap-2 overflow-y-scroll pt-4">
            {menuItems.map((item, index) => {
              // Only render if the item or at least one of its children has permissions
              if (!shouldShowMenuItem(item)) {
                return null;
              }

              return (
                <div key={index} className="flex flex-col gap-2">
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
                  {activeMenuItemId === item.id && (
                    <div className="flex flex-col gap-2">
                      {item.items?.map((child, index) => {
                        // Only render children that have permissions
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
        </div>

        <main className="ml-0 flex grow flex-col gap-2 overflow-y-scroll p-6 md:ml-[264px]">{children}</main>
      </div>
    </>
  );
};

export default Sidebar;
