import { message } from "antd";
import "@/assets/scss/overwrite/index.scss";
import imageError from "@/assets/images/imgError-table.jpg";
import imageFile from "@/assets/images/img-file.png";
import PDF from "@/assets/images/pdf.png";
import EXCEL from "@/assets/images/excel.png";
import WORD from "@/assets/images/word.jpg";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import clsx from "clsx";

interface IProps {
  value?: File | File[] | string;
  onChange: (value: File | File[] | null) => void;
  id?: string;
  error?: string;
}
const FormUploadImage: React.FC<IProps> = ({ onChange, value, id }) => {
  const [fileList, setFileList] = useState<File[] | any>(value ? value : []);

  const [error, setError] = useState<string | null>(null);
  const handleDeleteImage = (uid: string) => {
    const updatedFileList = fileList.filter((file: File) => file.name !== uid);
    setFileList(updatedFileList);
  };

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
  const renderFileIcon = (file: File) => {
    const validImageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp", "svg"];

    if (file.type.startsWith("image/") || validImageExtensions.some((ext) => file.name.endsWith(ext))) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-[100px] rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.src = imageError;
          }}
        />
      );
    } else if (file.type.startsWith("application/")) {
      if (file.type.startsWith("application/msword")) {
        return <img src={WORD} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
      }
      if (file.type.startsWith("application/vnd.ms-excel")) {
        return <img src={EXCEL} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
      }
      if (file.type.startsWith("application/pdf")) {
        return <img src={PDF} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
      } else {
        return <img src={imageFile} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
      }
    } else {
      return <img src={imageFile} alt={file.name} className="h-[100px] rounded-lg object-cover" />;
    }
  };
  useEffect(() => {
    value && value.length && setFileList(value);
  }, [JSON.stringify(value)]);
  return (
    <div className="custom-upload flex h-[240px] items-center justify-center rounded-lg bg-gray-25 px-3 py-6">
      <div className="flex-col items-center gap-4">
        <div className="flex justify-center">
          {fileList.map((file: File, index: number) => (
            <div key={index} className="relative mx-2 inline-block text-center">
              {renderFileIcon(file)}
              <button onClick={() => handleDeleteImage(file.name)}>
                <IoIosCloseCircle className="absolute right-1 top-1 h-[24px] w-[24px] rounded-circle text-green-100" />
              </button>
            </div>
          ))}
        </div>
        {fileList.length === 0 && <div className="mt-3 text-center font-normal text-gray-400">Kéo hoặc thả file vào đây</div>}
        <div className="mt-4 flex justify-center">
          <label
            htmlFor={`file-upload-${id}`}
            className="text-m-medium inline-block cursor-pointer rounded bg-cyan-50 px-[14px] py-[10px] text-cyan-600"
          >
            Tải file lên
          </label>
          <input id={`file-upload-${id}`} type="file" onChange={handleFileChange} multiple className="hidden" />
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
