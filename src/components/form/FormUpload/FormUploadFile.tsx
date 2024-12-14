import FormUploadImage from "@/components/form/FormUpload/FormUploadImage";
import React from "react";
import FormSingleFile from "./FormSingleFile";

interface IProps {
  value?: File | File[] | string;
  onChange: (value: File | File[] | null) => void;
  isMultiple?: boolean;
  disabled?: boolean;
  name?: string; // Thêm prop name để phân biệt các instance
  error?: string;
  classNameFilMany?: string;
  classNameOneFile?: string;
}

const MemoizedFormUploadImage = React.memo(FormUploadImage);
const MemoizedFormSingleFile = React.memo(FormSingleFile);

<<<<<<< HEAD
const FormUploadFile = ({ value, onChange, isMultiple, name, error, classNameFilMany, isDisabled }: IProps) => {
=======
const FormUploadFile = ({ value, onChange, isMultiple, disabled, name, error, classNameFilMany }: IProps) => {
>>>>>>> b46b61644eb37678ebb5b02b9646888a6eaa4c87
  return isMultiple ? (
    <MemoizedFormUploadImage onChange={onChange} value={value} id={name} error={error} disabled={disabled} classNameFilMany={classNameFilMany} />
  ) : (
    <MemoizedFormSingleFile value={value as File} onChange={onChange} id={name} error={error} disabled={disabled} />
  );
};

export default FormUploadFile;
