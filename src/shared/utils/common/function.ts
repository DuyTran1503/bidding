import { ETYPEFILE } from "@/shared/enums/fileType";

export const phoneRegex = /^0[1-9]{1}([0-9]{8})$/;
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
    return ETYPEFILE.image;
  }

  if (wordExtensions.includes(ext)) {
    return ETYPEFILE.word;
  }

  if (excelExtensions.includes(ext)) {
    return ETYPEFILE.excel;
  }

  if (powerpointExtensions.includes(ext)) {
    return ETYPEFILE.powerpoint;
  }

  if (ext === "pdf") {
    return ETYPEFILE.pdf;
  }

  if (audioExtensions.includes(ext)) {
    return ETYPEFILE.mp3;
  }

  if (videoExtensions.includes(ext)) {
    return ETYPEFILE.mp4;
  }

  return ETYPEFILE.unknow;
};
