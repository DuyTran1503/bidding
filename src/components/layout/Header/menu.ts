export type IMenuItem = {
  label: string;
  path?: string;
  items?: IMenuItem[];
};

export const menu: IMenuItem[] = [
  {
    label: "Trang chủ",
    path: "/",
  },
  {
    label: "Giới thiệu",
    path: "/introduce"
  },
  {
    label: "Tin tức",
    path: "/news",
  },
  // {
  //   label: "Hướng dẫn",
  //   path: "/instruct",
  // },
  {
    label: "Liên hệ & Hỗ trợ",
    path: "/support",
    items:[
      {
        label: "Yêu cầu đã gửi",
        path: "/support"
      },
      // {
      //   label: "Yêu cầu đã có phản hồi",
      //   path: "support/status/2"
      // },
      // {
      //   label: "Yêu cầu đã đóng",
      //   path: "support/status/3"
      // },
      {
        label: "Tạo mới yêu cầu",
        path: "support/create"
      },
    ]
  },
];