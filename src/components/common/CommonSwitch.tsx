import { Switch as AntSwitch, Tooltip as AntTooltip } from "antd";
import { useMemo } from "react";

interface Props {
  title: string;
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
  toolTipPosition?: "top" | "bottom" | "left" | "right";
  loading?: boolean;
  color?: string;
}

const CommonSwitch = (props: Props) => {
  const { title, checked, onChange, disabled = false, toolTipPosition = "top", loading, color = "#0891b2"} = props;

  const SwitchComponent = useMemo(
    () => <AntSwitch checked={checked} disabled={disabled} onChange={onChange} loading={loading}  style={{
      backgroundColor: checked ? color : undefined, // Màu khi bật
      borderColor: color, // Viền của toggle
    }}/>,
    [checked, disabled, onChange, loading, color],
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
