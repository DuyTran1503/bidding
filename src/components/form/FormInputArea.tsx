import React from "react";
import { Input } from "antd";
import clsx from "clsx";
const { TextArea } = Input;

interface FormInputAreaProps {
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  isReadonly?: boolean;
  onChange?: (value: string) => void;
  error?: string;
}
const FormInputArea: React.FC<FormInputAreaProps> = ({ label, placeholder, name, value, isReadonly, defaultValue, onChange, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (onChange) {
      onChange(inputValue);
    }
  };
  return (
    <div>
      {label && <label className="text-m-medium mb-1 text-black-300">{label}</label>}
      <TextArea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        readOnly={isReadonly}
        defaultValue={defaultValue}
        rows={5}
        className={clsx("custom-textarea min-h-[500px] bg-gray-25 px-2 py-3 font-normal", { readonly: isReadonly })}
      />
      {!!error && (
        <div className={clsx("placeholder:text-m-medium flex-1 grow border-red-500 py-[10px] font-normal text-red-500 outline-none focus:bg-white")}>
          {error}
        </div>
      )}
    </div>
  );
};
export default FormInputArea;
