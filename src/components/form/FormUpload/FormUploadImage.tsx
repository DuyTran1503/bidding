import { message } from "antd";
import "@/assets/scss/overwrite/index.scss";
import imageError from "@/assets/images/imgError-table.jpg";
import imageFile from "@/assets/images/img-file.png";
import PDF from "@/assets/images/pdf.png";
import EXCEL from "@/assets/images/excel.png";
import WORD from "@/assets/images/word.jpg";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

interface IProps {
  value?: File | File[] | string;
  onChange: (value: File | File[] | null) => void;
  id?: string;
}
const FormUploadImage: React.FC<IProps> = ({ onChange, value }) => {
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
  const validImageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp", "svg"];
  const renderFileIcon = (file: File) => {
    if (file.type.startsWith("image/") && (file.type || validImageExtensions.includes(file.type))) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-[100px] w-[100px] rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.src = imageError;
          }}
        />
      );
    } else if (file.type && file.type.startsWith("application/")) {
      let icon;
      if (file.type.startsWith("application/msword")) {
        return (icon = WORD);
      }
      if (file.type.startsWith("application/vnd.ms-excel")) {
        return (icon = EXCEL);
      }
      if (file.type.startsWith("application/pdf")) {
        return (icon = PDF);
      } else {
        icon = imageFile;
      }
      return <img src={icon} alt={file.name} className="h-[100px] w-[100px] rounded-lg object-cover" />;
    } else {
      return <img src={imageFile} alt={file.name} className="h-[100px] w-[100px] rounded-lg object-cover" />;
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
            htmlFor="file-upload"
            className="text-m-medium inline-block cursor-pointer rounded bg-primary-50 px-[14px] py-[10px] text-primary-500"
          >
            Tải file lên
          </label>
          <input id="file-upload" type="file" onChange={handleFileChange} multiple className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default FormUploadImage;
