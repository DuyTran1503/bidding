import { ConfigProvider, Switch } from "antd";
import { SwitchChangeEventHandler } from "antd/es/switch";

export interface IFormSwitchProps {
  checkedText?: string;
  uncheckedText?: string;
  onChange?: SwitchChangeEventHandler;
  idDisabled?: boolean;
  label?: string;
  checked?: boolean;
}

const FormSwitch = ({ checkedText, uncheckedText, idDisabled, label, onChange, checked }: IFormSwitchProps) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Switch: {
            colorPrimary: "#883DCF",
            colorPrimaryHover: "#883DCF",
          },
        },
      }}
    >
      <div className="flex flex-col items-start gap-[14px]">
        {label && <div className="text-base mb-1 text-black-300">{label}</div>}
        <Switch checked={checked} unCheckedChildren={uncheckedText} checkedChildren={checkedText} disabled={idDisabled} onChange={onChange} />
      </div>
    </ConfigProvider>
  );
};

export default FormSwitch;
