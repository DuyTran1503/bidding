import { IOption } from "@/shared/utils/shared-interfaces";
import { ConfigProvider, Select } from "antd";
import clsx from "clsx";

interface IFormSelect {
  label?: string;
  placeholder?: string;
  options: IOption[];
  defaultValue?: number[] | string;
  value?: string;
  isMultiple?: boolean;
  error?: string;
  isDisabled?: boolean;
  onChange?: (value: string | string[]) => void;
  id?: string;
}

const FormSelect = ({ label, isDisabled, placeholder, options, defaultValue, isMultiple, onChange, value }: IFormSelect) => {
  const handleChange = (value: string | string[]) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div>
      <div className="text-m-medium mb-1 text-black-300">{label}</div>
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
          className={clsx("text-m-medium w-full", isDisabled && "opacity-65")}
          mode={isMultiple ? "multiple" : undefined}
          defaultValue={defaultValue}
          value={value}
          onChange={(value) => !isDisabled && handleChange(value as any)}
          showSearch
          placeholder={placeholder}
          optionFilterProp="label"
          filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
          options={options}
        />
      </ConfigProvider>
    </div>
  );
};

export default FormSelect;
