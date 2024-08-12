import { ETYPEFILE } from "@/shared/enums/fileType";
import { PayloadErrors } from "@/shared/interface/error";

export const phoneRegex = /^(?:\+84|0084|0)?[235789][0-9]{8}$/;
//chặn khoảng trắng
export const removeMultipleSpaces = function (value: any) {
  return Object.keys(value)?.reduce((prev: any, key: string, index: number) => {
    // newValue[key] = newValue[key].replace(/\s{2,}/g, ' ');
    return {
      ...prev,
      [key]: typeof value?.[key] === "string" ? `${value[key]}`?.replace(/\s{2,}/g, " ") : value?.[key],
    };
  }, {});
};
export const getFileExtension = (url: string): ETYPEFILE => {
  if (!url || url.length < 0) return ETYPEFILE.unknow;

  const parts = url.split(".");
  const ext = parts[parts.length - 1];

  const imageExtensions = ["jpeg", "jpg", "png", "gif"];
  const wordExtensions = ["doc", "docx"];
  const excelExtensions = ["xlsx", "xls"];
  const powerpointExtensions = ["ppt", "pptx"];
  const videoExtensions = ["avi", "mp4", "wmv", "mkv", "mpeg"];
  const audioExtensions = ["mp3", "wma", "wav"];

  if (imageExtensions.includes(ext)) {
    return ETYPEFILE.IMAGE;
  }

  if (wordExtensions.includes(ext)) {
    return ETYPEFILE.WORD;
  }

  if (excelExtensions.includes(ext)) {
    return ETYPEFILE.EXCEL;
  }

  if (powerpointExtensions.includes(ext)) {
    return ETYPEFILE.POWERPOINT;
  }

  if (ext === "pdf") {
    return ETYPEFILE.PDF;
  }

  if (audioExtensions.includes(ext)) {
    return ETYPEFILE.mp3;
  }

  if (videoExtensions.includes(ext)) {
    return ETYPEFILE.mp4;
  }

  return ETYPEFILE.unknow;
};
export const transformPayloadErrors = (arr: PayloadErrors): string => {
  for (const key in arr) {
    if (arr.hasOwnProperty(key) && arr[key].length > 0) {
      return arr[key][0]; // Trả về giá trị đầu tiên từ mảng của key đầu tiên
    }
  }

  return ""; // Trả về undefined nếu không có giá trị hợp lệ
};
export const convertDataOption = (data: any[]) => {
  return data?.map((item: any) => ({
    value: item.id,
    label: item.name,
  }));
};
export const selectedData = (data: any[], id: string | number) => {
  return data?.find((item: any) => item.id === +id);
};
