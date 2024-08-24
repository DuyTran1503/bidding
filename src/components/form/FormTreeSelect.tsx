import { ConfigProvider, TreeSelect } from "antd";
import clsx from "clsx";

interface IFormTreeSelect {
  label?: string;
  placeholder?: string;
  treeData: { title: string; value: string; children?: any[] }[];
  defaultValue?: string | string[];
  isDisabled?: boolean;
  error?: string;
  onChange?: (value: string | string[]) => void;
  value?: string | string[];
}

const FormTreeSelect = ({ label, isDisabled, placeholder, treeData, defaultValue, onChange, error, value }: IFormTreeSelect) => {
  const handleChange = (value: string | string[]) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div>
      {label && <div className="text-m-medium mb-1 text-black-300">{label}</div>}
      <ConfigProvider
        theme={{
          components: {
            TreeSelect: {
              colorPrimary: "#883dcf",
            },
          },
        }}
      >
        <TreeSelect
          allowClear
          disabled={isDisabled}
          className={clsx("w-full", isDisabled && "opacity-65")}
          value={value}
          onChange={(value) => !isDisabled && handleChange(value)}
          showSearch
          placeholder={placeholder}
          defaultValue={defaultValue}
          treeData={treeData}
          fieldNames={{ label: "title", value: "value", children: "children" }}
          multiple={false} // Chọn chế độ đơn chọn hoặc nhiều tùy thuộc vào yêu cầu
        />
      </ConfigProvider>

      {!!error && (
        <div className={clsx("flex-1 grow border-red-500 py-[10px] font-normal text-red-500 outline-none placeholder:font-medium focus:bg-white")}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormTreeSelect;
