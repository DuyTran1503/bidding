export const convertDataOptions = <T extends { id: number | string; name: string }>(data: T[]): { value: number | string; label: string }[] => {
  if (!Array.isArray(data)) {
    return []; // Trả về mảng rỗng
  }

  const result = data.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return result;
};

type InputFileData = {
  type: string; // Loại file (e.g., pdf, word, image,...)
  path: string; // Đường dẫn file
  name: string; // Tên file
};

export const convertToFileObject = (input: InputFileData | InputFileData[] | File | File[]): File | File[] => {
  if (Array.isArray(input)) {
    if (input.every((item) => item instanceof File)) {
      return input;
    }
    return input.map((item) => (item instanceof File ? item : createFileObject(item)));
  } else {
    if (input instanceof File) {
      return input;
    }
    return createFileObject(input);
  }
};

const createFileObject = (item: InputFileData): File => {
  if (!item || typeof item !== "object" || !item.path || !item.name) {
    throw new Error('Invalid input object. Must contain "path" and "name".');
  }

  const mimeType = getMimeType(item.name);

  const blob = new Blob([], { type: mimeType });

  return new File([blob], item.name, {
    type: mimeType,
    lastModified: Date.now(),
  });
};

// Hàm phụ để xác định MIME type từ phần mở rộng file
const getMimeType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const mimeTypes: { [key: string]: string } = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    txt: "text/plain",
    csv: "text/csv",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    // Add more MIME types as needed
  };

  return mimeTypes[extension] || "application/octet-stream";
};
