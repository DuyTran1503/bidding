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
}

const FormTreeSelect = ({
    label,
    isDisabled,
    placeholder,
    treeData,
    defaultValue,
    onChange,
    error,
}: IFormTreeSelect) => {
    const handleChange = (value: string | string[]) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div>
            {label && <div className="text-base mb-1 text-black-300">{label}</div>}
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
                    className={clsx(" w-full", isDisabled && "opacity-65")}
                    value={defaultValue}
                    onChange={(value) => !isDisabled && handleChange(value)}
                    showSearch
                    placeholder={placeholder}
                    treeData={treeData}
                    fieldNames={{ label: 'title', value: 'value', children: 'children' }}
                    multiple={false} // Chọn chế độ đơn chọn hoặc nhiều tùy thuộc vào yêu cầu
                />
            </ConfigProvider>

            {!!error && (
                <div
                    className={clsx(
                        "font-normal placeholder:font-medium flex-1 grow border-red-500 py-[10px] text-red-500 outline-none focus:bg-white",
                    )}
                >
                    {error}
                </div>
            )}
        </div>
    );
};

export default FormTreeSelect;
