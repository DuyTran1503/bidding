import FormUploadImage from "@/components/form/FormUpload/FormUploadImage";
import React from "react";
import FormSingleFile from "./FormSingleFile";

interface IProps {
  value?: File | File[] | string;
  onChange: (value: File | File[] | null) => void;
  isMultiple?: boolean;
  name?: string; // Thêm prop name để phân biệt các instance
  error?: string;
  classNameFilMany?: string;
  classNameOneFile?: string;
}

const MemoizedFormUploadImage = React.memo(FormUploadImage);
const MemoizedFormSingleFile = React.memo(FormSingleFile);

const FormUploadFile = ({ value, onChange, isMultiple, name, error, classNameFilMany }: IProps) => {
  return isMultiple ? (
    <MemoizedFormUploadImage onChange={onChange} value={value} id={name} error={error} classNameFilMany={classNameFilMany} />
  ) : (
    <MemoizedFormSingleFile value={value as File} onChange={onChange} id={name} error={error} />
  );
};

export default FormUploadFile;
