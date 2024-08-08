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
}

const FormDate: React.FC<FormDateProps> = ({ label, onChange, defaultValue, value, disabled, minDate, maxDate }: FormDateProps) => {
  const handleChange: DatePickerProps<Dayjs>["onChange"] = (date, dateString) => {
    if (onChange) {
      onChange(date, dateString as string);
    }
  };

  return (
    <div className={clsx("flex items-center gap-2")}>
      {label && <div className="text-base mb-1 text-black-300">{label}</div>}

      <DatePicker
        onChange={handleChange}
        defaultValue={defaultValue}
        minDate={minDate}
        maxDate={maxDate}
        value={value}
        disabled={disabled}
        className="custom-datepicker w-full rounded-md bg-gray-25 py-2"
      />
    </div>
  );
};

export default FormDate;
