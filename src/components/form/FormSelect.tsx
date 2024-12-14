import { IOption } from "@/shared/utils/shared-interfaces";
import { ConfigProvider, Select } from "antd";
import clsx from "clsx";

interface IFormSelect {
  label?: string;
  placeholder?: string;
  options: IOption[];
  defaultValue?: number[] | string[] | string | number;
  value?: string | string[] | number[] | number;
  isMultiple?: boolean;
  error?: string | string[];
  isDisabled?: boolean;
  onChange?: (value: string | string[] | number | number[]) => void;
  id?: string;
  className?: string;
  showLabel?: boolean; // Thêm prop showLabel
}

const FormSelect = ({
  label,
  className,
  isDisabled,
  placeholder,
  options,
  defaultValue,
  isMultiple,
  onChange,
  value,
  error,
  showLabel = true, // Mặc định là true nếu không truyền vào
}: IFormSelect) => {
  const handleChange = (value: string | string[] | number | number[]) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <>
      {showLabel && label && <div className="text-m-medium mb-1 w-full text-black-300">{label}</div>}
      <ConfigProvider
        theme={{
          components: {
            Select: {
              optionSelectedBg: "#ecfeff",
              colorPrimary: "#0891b2",
            },
          },
        }}
      >
        <Select
          allowClear
          maxTagCount="responsive"
          disabled={isDisabled}
          className={clsx(
            `text-m-medium !h-[35px] w-full rounded-[4px] border !border-[#e0e2e7] ${className}`,
            {
              " !text-black-900": isDisabled,
              "border-red-500": !!error,
              "select-none !bg-gray-50 !text-black-300": error,
            }
          )}
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
          <div className={clsx("placeholder:text-m-medium flex-1 grow border-red-500 py-[6px] font-normal text-red-500 outline-none focus:bg-white")}>
            {error}
          </div>
        )}
      </ConfigProvider>
    </>
  );
};

export default FormSelect;
