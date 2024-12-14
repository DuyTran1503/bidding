import React, { Fragment, useState } from "react";
import type { RadioChangeEvent } from "antd";
import { Radio, Space } from "antd";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import clsx from "clsx";

interface IOption {
  value: number | string;
  label: string;
}

interface IProps {
  options: IOption[];
  onChange?: (e: RadioChangeEvent) => void;
  value: string;
  title?: string;
  error?: string | string[];
  direction?: "vertical" | "horizontal";
  isDisplay?: boolean;
  isDisabled?: boolean;
}

const FormRadio: React.FC<IProps> = ({ options, onChange, value, error, isDisabled, title, direction = "horizontal", isDisplay }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <Fragment>
      <div className="flex w-full items-center justify-between">
        {title && <label className="text-m-medium block text-black-300">{title}</label>}
        {isDisplay && (
          <div onClick={toggle} className="cursor-pointer pr-3">
            {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
          </div>
        )}
      </div>
      {isOpen && (
        <Radio.Group onChange={onChange} value={value}>
          <Space direction={direction}>
            {options.map((option) => (
              <Radio key={option.value} value={option.value} disabled={isDisabled}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )}
      {!!error && (
        <div className={clsx("placeholder:text-m-medium flex-1 grow border-red-500 py-[6px] font-normal text-red-500 outline-none focus:bg-white")}>
          {error}
        </div>
      )}
    </Fragment>
  );
};

export default FormRadio;
