import FormUploadImage from "@/components/form/FormUpload/FormUploadImage";
import React from "react";
import FormSingleFile from "./FormSingleFile";

interface IProps {
  value?: File | File[] | string;
  onChange: (value: File | File[] | null) => void;
  isMultiple?: boolean;
  name?: string; // Thêm prop name để phân biệt các instance
}

const MemoizedFormUploadImage = React.memo(FormUploadImage);
const MemoizedFormSingleFile = React.memo(FormSingleFile);

const FormUploadFile = ({ value, onChange, isMultiple, name }: IProps) => {
  return isMultiple ? (
    <MemoizedFormUploadImage
      onChange={onChange}
      value={value}
      id={name} // Truyền name như là id
    />
  ) : (
    <MemoizedFormSingleFile
      value={value as File}
      onChange={onChange}
      id={name} // Truyền name như là id
    />
  );
};

export default FormUploadFile;
