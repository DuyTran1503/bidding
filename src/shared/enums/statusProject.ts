export enum STATUS_PROJECT {
  AWAITING = 1, // Chờ phê duyệt
  REJECT = 2, // Trả về
  APPROVED = 3, // Đã phê duyệt
}

export const STATUS_PROJECT_LABELS: { [key in STATUS_PROJECT]: string } = {
  [STATUS_PROJECT.AWAITING]: "Chờ phê duyệt",
  [STATUS_PROJECT.REJECT]: "Trả về",
  [STATUS_PROJECT.APPROVED]: "Đã phê duyệt",
};
export const STATUS_PROJECT_ARRAY = Object.keys(STATUS_PROJECT)
  .filter((key) => isNaN(Number(key))) // Lọc ra chỉ các key là tên enum
  .map((key) => ({
    value: STATUS_PROJECT[key as unknown as keyof typeof STATUS_PROJECT],
    label: STATUS_PROJECT_LABELS[STATUS_PROJECT[key as unknown as keyof typeof STATUS_PROJECT]],
  }));
