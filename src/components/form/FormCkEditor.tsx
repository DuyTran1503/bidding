import { Col, Row } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import { ForwardedRef, forwardRef, memo, useMemo } from "react";
import CustomFormikEditor from "../ckfinder/CustomizeCkfinder";
import clsx from "clsx";

interface Props {
  id: string;
  label?: string;
  value: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
  onChange?: (value: string) => void;
  disabled?: boolean;
  direction?: "vertical" | "horizontal";
  isRequired?: boolean;
  errors?: FormikErrors<any>;
  touched?: FormikTouched<any>;
  className?: string;
  error?: string;
}

const FormCkEditor = forwardRef(function FormCkEditor(props: Props, ref?: ForwardedRef<any>) {
  const { id, label, value, setFieldValue, onChange, disabled, direction = "vertical", isRequired,error, errors, touched, className } = props;

  const Label = () =>
    label ? (
      <label htmlFor={id} className={`text-medium-md ${isRequired ? "required-start" : ""}`}>
        {label}
      </label>
    ) : null;

  const Editor = useMemo(
    () => <CustomFormikEditor id={id} name={id} value={value} onChange={onChange} setFieldValue={setFieldValue} readonly={disabled} />,
    [disabled, id, setFieldValue, value],
  );

  const Error = () => errors?.[id] && touched?.[id] && <div className="block text-red-500">{`${errors[id]}`}</div>;

  return direction === "vertical" ? (
    <div ref={ref} className={`flex w-full flex-col items-start ${className || ""}`}>
      <Label />
      {Editor}
      <Error />
      {!!error && (
        <div className={clsx("placeholder:text-m-medium flex-1 grow border-red-500 py-[10px] font-normal text-red-500 outline-none focus:bg-white")}>
          {error}
        </div>
      )}
    </div>
  ) : (
    <Row ref={ref} className={`${className || ""}`}>
      <Col xs={24} lg={6}>
        <Label />
      </Col>
      <Col xs={24} lg={18}>
        {Editor}
        <Error />
      </Col>
      {!!error && (
        <div className={clsx("placeholder:text-m-medium flex-1 grow border-red-500 py-[10px] font-normal text-red-500 outline-none focus:bg-white")}>
          {error}
        </div>
      )}
    </Row>
  );
});

export default memo(FormCkEditor);
