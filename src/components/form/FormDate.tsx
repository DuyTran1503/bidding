import React from "react";
import { DatePicker } from "antd";
import type { DatePickerProps } from "antd";

import type { Dayjs } from "dayjs";
import clsx from "clsx";

interface FormDateProps {
  label?: string;
  onChange?: (date: Dayjs, dateString: string) => void;
  defaultValue?: Dayjs;
  id?: string;
  value?: Dayjs | null;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabled?: boolean;
  error?: string;
}

const FormDate: React.FC<FormDateProps> = ({ label, onChange, error, defaultValue, value, disabled, minDate, maxDate }: FormDateProps) => {
  const handleChange: DatePickerProps<Dayjs>["onChange"] = (date, dateString) => {
    if (onChange) {
      onChange(date, dateString as string);
    }
  };
  return (
    <div className={clsx("flex flex-col items-start")}>
      {label && <div className="text-m-medium mb-1 text-black-300">{label}</div>}

      <DatePicker
        onChange={handleChange}
        defaultValue={defaultValue}
        minDate={minDate}
        placeholder="Chọn thời gian..."
        maxDate={maxDate}
        value={value}
        disabled={disabled}
        className="custom-datepicker !h-[35px] w-full rounded-md bg-gray-25"
      />
      {!!error && (
        <div className={clsx("placeholder:text-m-medium flex-1 grow border-red-500 py-[10px] font-normal text-red-500 outline-none focus:bg-white")}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormDate;
