type BaseMenuItem = {
  label: string;
};

type WithPath = BaseMenuItem & {
  path: string;
  items?: never;
};

type WithChildren = BaseMenuItem & {
  items: IMenuItem[];
  path?: never;
};

export type IMenuItem = WithPath | WithChildren;

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
    path: "/",
  },
  {
    label: "Hướng dẫn",
    path: "/",
  },
  {
    label: "Liên hệ & Hỗ trợ",
    path: "/",
  },
];
