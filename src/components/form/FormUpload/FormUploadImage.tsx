import { message } from "antd";
import "@/assets/scss/overwrite/index.scss";
import imageError from "@/assets/images/imgError-table.jpg";
import imageFile from "@/assets/images/img-file.png";
import PDF from "@/assets/images/pdf.png";
import EXCEL from "@/assets/images/excel.png";
import WORD from "@/assets/images/word.jpg";
import ZIP from "@/assets/images/winrar-min.png";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import clsx from "clsx";
interface FileData {
  type: string;
  path: string;
  name: string;
  size: number | string | any;
}
interface IProps {
  value?: File | File[] | string;
  onChange: (value: File | File[] | null) => void;
  id?: string;
  error?: string;
  classNameFilMany?: string;
  disabled?: boolean;
}
export const convertToFiles = (dataArray: FileData[]): File[] => {
  const currentTime = new Date().getTime();

  return dataArray.map((item) => {
    const fileType = item.type === "pdf" ? "application/pdf" : "application/octet-stream";
    const blob = new Blob([new Uint8Array(item.size)], { type: fileType });
    return new File([blob], item.name, {
      type: blob.type,
      lastModified: currentTime,
    });
  });
};
export const renderFileIcon = (file: File | FileData | any) => {
  const validImageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp", "svg"];
  const fileName = file.name?.toLowerCase() || "";
  const fileType = file.type?.toLowerCase() || "";

  const isImage = fileType.startsWith("image/") || validImageExtensions.some((ext) => fileName.endsWith(`.${ext}`));
  const isWord = fileType.startsWith("application/msword") || fileName.endsWith(".doc") || fileName.endsWith(".docx");
  const isExcel = fileType.startsWith("application/vnd.ms-excel") || fileName.endsWith(".xls") || fileName.endsWith(".xlsx");
  const isPDF = fileType === "application/pdf" || fileName.endsWith(".pdf");
  const isZip = fileType === "application/zip" || fileName.endsWith(".zip");
  const isRar = fileType === "application/x-rar-compressed" || fileName.endsWith(".rar");
  const isText = fileType.startsWith("text/") || fileName.endsWith(".txt");

  if (file instanceof File) {
    if (isImage) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-[100px] rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.src = imageError; // Fallback image
          }}
        />
      );
    }
  }

  if (isWord) {
    return <img src={WORD} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
  }

  if (isExcel) {
    return <img src={EXCEL} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
  }

  if (isPDF) {
    return <img src={PDF} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
  }

  if (isZip) {
    return <img src={ZIP} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
  }

  if (isRar) {
    return <img src={ZIP} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
  }

  if (isText) {
    return <img src={imageFile} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
  }

  // Default fallback for other file types
  return <img src={imageFile} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
};
const FormUploadImage: React.FC<IProps> = ({ onChange, value, id, classNameFilMany, disabled }) => {
  const [fileList, setFileList] = useState<File[] | any>(value ? value : []);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: File[] = Array.from(files);
      newFiles.forEach((file) => {
        if (file.name === "error.jpg") {
          message.error("Error uploading file, please try again");
          setError(`Error uploading file, please try again ${error}`);
          return;
        }
      });

      setFileList((prevFileList: any) => [...prevFileList, ...newFiles]);
    }
  };
  useEffect(() => {
    if (typeof onChange === "function") {
      onChange(fileList.length > 0 ? fileList : null);
    }
  }, [fileList]);
  const handleDeleteImage = (index: number) => {
    const updatedFileList = fileList.filter((file: File, i: number) => i !== index);
    setFileList(updatedFileList);
  };

  useEffect(() => {
    value && value.length && setFileList(value);
  }, [JSON.stringify(value)]);
  return (
    <div
      className={`custom-upload flex items-center justify-center rounded-lg bg-gray-25 px-3 py-6 ${!!classNameFilMany ? classNameFilMany : "h-[260px]"}`}
    >
      <div className="flex-col items-center gap-4">
        <div className="flex justify-center">
          {fileList.map((file: File | FileData | any, index: number) => (
            <div key={index} className="relative mx-2 inline-block text-center">
              {renderFileIcon(file)}
              <button onClick={() => handleDeleteImage(index)} type="button">
                <IoIosCloseCircle className={clsx("absolute right-1 top-1 h-[24px] w-[24px] rounded-circle text-green-100", { hidden: disabled })} />
              </button>
            </div>
          ))}
        </div>
        {fileList.length === 0 && <div className="mt-3 text-center font-normal text-gray-400">Kéo hoặc thả file vào đây</div>}
        <div className="mt-4 flex justify-center">
          <label
            htmlFor={`file-upload-${id}`}
            className={clsx("text-m-medium inline-block cursor-pointer rounded bg-cyan-50 px-[14px] py-[10px] text-cyan-600", { hidden: disabled })}
          >
            Tải file lên
          </label>
          <input id={`file-upload-${id}`} type="file" onChange={handleFileChange} multiple className="hidden" disabled={disabled} />
        </div>
      </div>
      {!!error && (
        <div className={clsx("placeholder:text-m-medium flex-1 grow border-red-500 py-[10px] font-normal text-red-500 outline-none focus:bg-white")}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormUploadImage;
