export enum STATUS_PROJECT {
  AWAITING = 0, // Chờ phê duyệt
  REJECT = 1, // Trả về
  RECEIVED = 2, // Tiếp nhận hồ sơ
  SELECTING_CONTRACTOR = 3, // Lựa chọn nhà thầu
  RESULTS_PUBLISHED = 4, // Công bố kết quả
}

export const STATUS_PROJECT_LABELS: { [key in STATUS_PROJECT]: string } = {
  [STATUS_PROJECT.AWAITING]: "Chờ phê duyệt",
  [STATUS_PROJECT.REJECT]: "Trả về",
  [STATUS_PROJECT.RECEIVED]: "Tiếp nhận hồ sơ",
  [STATUS_PROJECT.SELECTING_CONTRACTOR]: "Lựa chọn nhà thầu",
  [STATUS_PROJECT.RESULTS_PUBLISHED]: "Công bố kết quả",
};
export const STATUS_PROJECT_ARRAY = Object.keys(STATUS_PROJECT)
  .filter((key) => isNaN(Number(key))) // Lọc ra chỉ các key là tên enum
  .map((key) => ({
    value: STATUS_PROJECT[key as unknown as keyof typeof STATUS_PROJECT],
    label: STATUS_PROJECT_LABELS[STATUS_PROJECT[key as unknown as keyof typeof STATUS_PROJECT]],
  }));
