import { Switch as AntSwitch, Tooltip as AntTooltip } from "antd";
import { useMemo } from "react";

interface Props {
  title: string;
  label?: string;
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
  toolTip?: string;
  toolTipPosition?: "top" | "bottom" | "left" | "right";
  loading?: boolean;
}

const CommonSwitch = (props: Props) => {
  const { title, label, checked, onChange, disabled = false, toolTip, toolTipPosition = "top", loading } = props;

  const SwitchComponent = useMemo(
    () => <AntSwitch checked={checked} disabled={disabled} onChange={onChange} loading={loading} />,
    [checked, disabled, onChange, loading],
  );

  const TooltipComponent = title ? (
    <AntTooltip title={title} placement={toolTipPosition}>
      {SwitchComponent}
    </AntTooltip>
  ) : (
    SwitchComponent
  );

  return <div className="d-flex align-items-center column-gap-2">{TooltipComponent}</div>;
};

export default CommonSwitch;