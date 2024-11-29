import lodash from "lodash";
import { PropsWithChildren, useState } from "react";
import { IconType } from "react-icons";
import { useLocation, useNavigate } from "react-router-dom";

import MenuItem from "./MenuItem";

// Icons
import {
  IoBusinessOutline,
  IoNewspaperOutline,
  IoHome,
  IoSettingsOutline,
  IoInformationCircleOutline,
  IoHeadsetOutline,
  IoClose,
  IoMenu,
  IoPodiumOutline,
  IoChatbubblesOutline,
  IoReceiptOutline,
  IoTimerOutline,
  IoBookmarkOutline,
  IoFileTrayFullOutline,
  IoBriefcaseOutline,
} from "react-icons/io5";

// Images
import logo from "@/assets/images/logo.png";
import { RxComponent1 } from "react-icons/rx";
import { EPermissions } from "@/shared/enums/permissions";
import { useArchive } from "@/hooks/useArchive";
import { IAuthInitialState } from "@/services/store/auth/auth.slice";
import { checkPermission } from "@/helpers/checkPermission";

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
  const menuItems: IMenuItem[] = [
    {
      id: "1",
      label: "Trang chủ",
      path: "dashboard",
      icon: { component: IoHome },
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
          label: "Hồ sơ mời thầu",
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
        // {
        //   id: "2.2",
        //   label: "Lĩnh vực đấu thầu",
        //   path: "bidding-fields",
        //   permissions: EPermissions.LIST_BIDDING_FIELD,
        // },
        // {
        //   id: "2.3",
        //   label: "Loại hình đấu thầu",
        //   path: "bidding-types",
        //   permissions: EPermissions.LIST_BIDDING_TYPE,
        // },
        {
          id: "3.2",
          label: "Nhân viên",
          path: "employees",
          permissions: EPermissions.LIST_EMPLOYEE,
        },
        {
          id: "3.1",
          label: "Công việc",
          path: "task",
          permissions: EPermissions.LIST_TASK,
        },
      ],
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


    // {
    //   id: "4",
    //   label: "Nhân viên",
    //   icon: { component: IoPeopleOutline },
    //   items: [
    //   ],
    // },

    {
      id: "7",
      label: "Lịch sử đấu thầu",
      icon: { component: IoTimerOutline },
      items: [
        {
          id: "7.1",
          label: "Kết quả đấu thầu",
          path: "bidding-results",
          permissions: EPermissions.LIST_BIDDING_TYPE,
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
          id: "8.8",
          label: "Phê duyệt dự án",
          path: "project-approval",
          // permissions: EPermissions.LIST_STAFF,
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
          label: "Câu hỏi/ Câu trả lời",
          path: "questions-answers",
          permissions: EPermissions.LIST_QUESTIONS_ANSWERS,
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
      id: "6",
      icon: { component: IoBriefcaseOutline },
      label: "Loại hình mua sắm công",
      path: "procurement-categories",
      permissions: EPermissions.LIST_PROCUREMENT_CATEGORIE,
    },
    {
      id: "5",
      icon: { component: IoBookmarkOutline },
      label: "Hình thức lựa chọn Nhà thầu",
      path: "selection-methods",
      permissions: EPermissions.LIST_SELECTION_METHOD,
    },
    {
      id: "10",
      label: "Phản hồi và Khiếu nại",
      icon: { component: IoChatbubblesOutline },
      path: "feedback-complaint",
      permissions: EPermissions.LIST_FEEDBACK_COMPLAINT,
    },
    {
      id: "11",
      label: "Hỗ trợ",
      icon: { component: IoHeadsetOutline },
      path: "supports",
      permissions: EPermissions.LIST_SUPPORT,
    },
    {
      id: "12",
      label: "Giới thiệu",
      icon: { component: IoInformationCircleOutline },
      path: "introductions",
      permissions: EPermissions.LIST_INTRODUCTION,
    },
    {
      id: "13",
      label: "Hướng dẫn",
      icon: { component: IoNewspaperOutline },
      path: "instructs",
      permissions: EPermissions.LIST_INDUSTRY,
    },
    {
      id: "14",
      label: "Components",
      path: "components",
      icon: { component: RxComponent1 },
    },
  ];

  return (
    <>
      {/* Button to toggle sidebar on small screens */}
      <button
        className="fixed left-6 top-7 z-50 block rounded bg-blue-200 p-2 text-white hover:bg-blue-500 md:hidden"
        onClick={() => setSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? <IoClose size={24} /> : <IoMenu size={24} />}
      </button>

      <div className="flex h-dvh select-none bg-gray-25">
        {/* Sidebar */}
        <div
          className={`fixed bottom-0 left-0 top-0 z-40 flex w-[264px] flex-col bg-white transition-transform duration-300 md:translate-x-0 ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Logo */}
          <div className="flex cursor-pointer items-center gap-x-3 px-5 py-4" onClick={() => navigate("/dashboard")}>
            <img src={logo} alt="" className="w-20" />
            <div className="display-m-semibold">Septenary Solution</div>
          </div>

          {/* Navbar */}
          <nav className="no-scrollbar mb-2 flex grow flex-col gap-2 overflow-y-scroll pt-4">
            {menuItems.map((item, index) => {
              return (
                <div key={index} className="flex flex-col gap-2">
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
        </div>

        {/* Main content */}
        <main className="ml-0 flex grow flex-col gap-6 overflow-y-scroll p-6 md:ml-[264px]">{children}</main>
      </div>
    </>
  );
};

export default Sidebar;
