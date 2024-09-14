
export enum ETYPEACTIVITYLOG {
  CREATE = "Tạo mới",
  UPDATE = "Cập nhật",
  DESTROY = "Xóa",
}

export const activityLogOptions = [
  { value: "CREATE", label: "Tạo mới" },
  { value: "UPDATE", label: "Cập nhật" },
  { value: "DESTROY", label: "Xóa" },
];
