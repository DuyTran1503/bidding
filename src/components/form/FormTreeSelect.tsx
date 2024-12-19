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
  width?: string | number; // Thêm prop cho chiều rộng tùy chỉnh
  multiple?: boolean; // Cho phép chế độ chọn nhiều hoặc đơn
  height?: string | number; // Thêm prop cho chiều cao tùy chỉnh
}

const FormTreeSelect = ({
  label,
  isDisabled = false,
  placeholder,
  treeData,
  defaultValue,
  onChange,
  error,
  value,
  width = "100%", // Thiết lập giá trị mặc định cho chiều rộng
  multiple = false, // Thiết lập mặc định cho chế độ chọn đơn
  height = "auto", // Thiết lập giá trị mặc định cho chiều cao
}: IFormTreeSelect) => {
  const handleChange = (newValue: string | string[]) => {
    if (onChange) {
      onChange(newValue);
    }
  };
  return (
    <div style={{ width }}>
      {label && <div className="text-m-medium mb-1 text-black-300">{label}</div>}
      <ConfigProvider
        theme={{
          components: {
            TreeSelect: {
              colorPrimary: "#0891b2",
            },
          },
        }}
      >
        <TreeSelect
          allowClear
          disabled={isDisabled}
          className={clsx(
            "flex w-full shrink-0 items-center gap-1 overflow-hidden rounded-[4px] border border-gray-100 bg-gray-25",
            isDisabled && "opacity-65",
          )}
          value={value}
          onChange={(value) => !isDisabled && handleChange(value)}
          showSearch
          placeholder={placeholder}
          defaultValue={defaultValue}
          treeData={treeData}
          fieldNames={{ label: "title", value: "value", children: "children" }}
          multiple={multiple} // Cho phép chọn đơn hoặc nhiều dựa trên prop
          style={{ height }}
          filterTreeNode={(input, treeNode) => (treeNode.title && treeNode.title.toString().toLowerCase().includes(input.toLowerCase())) || false}
          // Tùy chỉnh cách thức tìm kiếm
        />
      </ConfigProvider>

      {!!error && (
        <div
          className={clsx(
            "placeholder:text-m-medium mt-[10px] flex-1 grow border-red-500 py-[6px] font-normal text-red-500 outline-none focus:bg-white",
          )}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default FormTreeSelect;
