import { ConfigProvider, Select } from "antd";
import clsx from "clsx";
interface IFormSelect {
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  defaultValue?: number[];
  isMultiple?: boolean;
  error?: string;
  isDisabled?: boolean;
  onChange?: (value: string | string[]) => void;
  id?: string;
}

const FormSelect = ({ label, isDisabled, placeholder, options, defaultValue, isMultiple, onChange }: IFormSelect) => {
  const handleChange = (value: string | string[]) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div>
      <div className="text-base mb-1 text-black-300">{label}</div>
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
          className={clsx("text-base w-full", isDisabled && "opacity-65")}
          mode={isMultiple ? "multiple" : undefined}
          defaultValue={defaultValue}
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
