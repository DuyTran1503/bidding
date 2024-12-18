/* eslint-disable max-len */
import { message } from "antd";
import "@/assets/scss/overwrite/index.scss";
import imageError from "@/assets/images/imgError-table.jpg";
import imageFile from "@/assets/images/img-file.png";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import clsx from "clsx";

interface IProps {
  value?: File;
  onChange: (value: File | null) => void;
  id?: string;
  error?: string;
  disabled?: boolean;
}

const FormSingleFile: React.FC<IProps> = ({ value, onChange, id, disabled }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFile(value || null);
  }, [value]);

  const handleDeleteImage = () => {
    setFile(null);
    onChange(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFile = files[0];
      if (newFile.name === "error.jpg") {
        message.error("Error uploading file, please try again");
        setError(`Error uploading file, please try again ${error}`);
        return;
      }
      setFile(newFile);
      onChange(newFile);
    }
  };

  const renderFileIcon = (file: File | string) => {
    const value = typeof file === "string" ? file : null;

    if (file instanceof File) {
      return file.type && file.type.startsWith("image/") ? (
        <img
          src={(() => {
            try {
              return URL.createObjectURL(file);
            } catch (error) {
              if (error instanceof TypeError && error.message.includes("Cannot create object URL")) {
                return `${import.meta.env.VITE_API_URL}/${value}`;
              } else {
                throw error;
              }
            }
          })()}
          alt={file.name}
          className="h-[100px] rounded-lg object-cover"
          onError={(e) => (e.currentTarget.src = imageError)}
        />
      ) : (
        <img src={imageFile} alt={file.name} className="h-[100px] rounded-lg object-cover" />
      );
    } else if (typeof file === "string") {
      const imageUrl = file.startsWith("https://") || file.startsWith("http://") ? file : `${import.meta.env.VITE_API_URL}/${file}`; 

      return <img src={imageUrl} alt={file} className="h-[100px] rounded-lg object-cover" />;
    } else {
      return null;
    }
  };

  return (
    <div className="custom-upload flex h-[235px] items-center justify-center rounded-lg bg-gray-25 px-3 py-6">
      <div className="flex-col items-center gap-4">
        <div className="flex justify-center">
          {file && (
            <div className="relative mx-2 inline-block text-center">
              {renderFileIcon(file)}
              <button onClick={handleDeleteImage}>
                <IoIosCloseCircle className={clsx("absolute right-1 top-1 h-[24px] w-[24px] rounded-circle text-green-100",{ "hidden": disabled })} />
              </button>
            </div>
          )}
        </div>
        {!file && <div className="mt-3 text-center font-normal text-gray-400">Kéo hoặc thả file vào đây</div>}
        <div className="mt-4 flex items-center gap-4 sm:flex-col md:justify-center">
          <label
            htmlFor={`file-upload-${id}`}
            className={clsx(
              "text-m-medium inline-block cursor-pointer rounded bg-cyan-50 px-[14px] py-[10px] text-cyan-600",
              { "hidden": disabled }
            )}
          >
            Tải file lên
          </label>
          <input id={`file-upload-${id}`} type="file" onChange={handleFileChange} className="hidden" disabled={disabled} />
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

export default FormSingleFile;
