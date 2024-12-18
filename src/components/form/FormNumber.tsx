import clsx from "clsx";
import { useState, useRef } from "react";
import { InputNumber } from "antd";

interface FormNumberProps {
  id?: string;
  label?: string;
  placeholder?: string;
  name?: string | string;
  value?: number;
  defaultValue?: number;
  isDisabled?: boolean;
  isReadonly?: boolean;
  autoFocus?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  onChange?: (value: number | null) => void;
}

const FormNumber = ({
  id,
  label,
  placeholder,
  value,
  defaultValue,
  name,
  isDisabled,
  isReadonly,
  autoFocus,
  onBlur,
  error,
  onChange,
}: FormNumberProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<any>(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div>
      {/* Label */}
      {label && <label className="text-m-medium mb-1 block text-black-300">{label}</label>}

      {/* InputNumber */}
      <div
        className={clsx(
          "flex items-center rounded-[4px]  border-gray-100 bg-gray-25",
          isFocused && "bg-white",
          error && "border-red-500"
        )}
      >
        <InputNumber
          id={id}
          ref={inputRef}
          value={value || null}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isReadonly}
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(val) => onChange?.(val)}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, ""))}
          className={clsx(
            "w-full bg-gray-25 py-[2px] px-1 text-black-500 outline-none focus:bg-white",
            {
              "select-none !bg-gray-50 !text-black-300": isDisabled || isReadonly,
            }
          )}
        />
      </div>

      {/* Error Message */}
      {!!error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default FormNumber;
