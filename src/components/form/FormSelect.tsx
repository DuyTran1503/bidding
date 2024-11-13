import { IOption } from "@/shared/utils/shared-interfaces";
import { ConfigProvider, Select } from "antd";
import clsx from "clsx";

interface IFormSelect {
  label?: string;
  placeholder?: string;
  options: IOption[];
  defaultValue?: number[] | string[] | string | number;
  value?: string | string[] | number[];
  isMultiple?: boolean;
  error?: string | string[];
  isDisabled?: boolean;
  onChange?: (value: string | string[]) => void;
  id?: string;
}

const FormSelect = ({ label, isDisabled, placeholder, options, defaultValue, isMultiple, onChange, value, error }: IFormSelect) => {
  const handleChange = (value: string | string[]) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div>
      <div className="text-m-medium mb-1 w-full text-black-300">{label}</div>
      <ConfigProvider
        theme={{
          components: {
            Select: {
              optionSelectedBg: "#f4ecfb",
              colorPrimary: "#883dcf",
            },
          },
        }}
      >
        <Select
          allowClear
          maxTagCount={"responsive"}
          disabled={isDisabled}
          className={clsx("text-m-medium w-full", isDisabled && "opacity-65", {
            "border-red-500": !!error,
            "select-none !bg-gray-50 !text-black-300": error,
          })}
          mode={isMultiple ? "multiple" : undefined}
          defaultValue={defaultValue}
          value={value}
          onChange={(value) => !isDisabled && handleChange(value as any)}
          showSearch
          placeholder={placeholder ?? "Chọn..."}
          optionFilterProp="label"
          filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
          options={options}
        />
        {!!error && (
          <div
            className={clsx("placeholder:text-m-medium flex-1 grow border-red-500 py-[10px] font-normal text-red-500 outline-none focus:bg-white")}
          >
            {error}
          </div>
        )}
      </ConfigProvider>
    </div>
  );
};

export default FormSelect;
