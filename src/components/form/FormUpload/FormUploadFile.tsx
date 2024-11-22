import React from "react";
import FormUploadImage from "@/components/form/FormUpload/FormUploadImage";
import FormSingleFile from "./FormSingleFile";

interface IProps {
  value?: File | File[] | string;
  onChange: (value: File | File[] | null) => void;
  isMultiple?: boolean;
  key?: string; // Thêm key để đảm bảo component được render lại
}

const FormUploadFile = ({ value, onChange, isMultiple, key }: IProps) => {
  return isMultiple ? (
    <FormUploadImage key={key} onChange={onChange} value={value} />
  ) : (
    <FormSingleFile key={key} value={value as File} onChange={onChange} />
  );
};

export default FormUploadFile;
