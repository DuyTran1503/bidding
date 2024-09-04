import FormUploadImage from "@/components/form/FormUpload/FormUploadImage";
import React from "react";
import FormSingleFile from "./FormSingleFile";

interface IProps {
  value?: File | File[];
  onChange: (value: File | File[] | null) => void;
  isMultiple?: boolean;
}
const MemoizedFormUploadImage = React.memo(FormUploadImage);
const MemoizedFormSingleFile = React.memo(FormSingleFile);

const FormUploadFile = ({ value, onChange, isMultiple }: IProps) => {
  return isMultiple ? (
    <MemoizedFormUploadImage onChange={onChange} value={value} />
  ) : (
    <MemoizedFormSingleFile value={value as File} onChange={onChange} />
  );
};

export default FormUploadFile;
