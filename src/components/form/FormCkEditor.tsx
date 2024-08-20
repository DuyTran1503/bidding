import { Col, Row } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import { ForwardedRef, forwardRef, memo, useMemo } from "react";
import CustomFormikEditor from "../ckfinder/CustomizeCkfinder";
// const CustomizeCkfinder = lazy(() => import("../ckfinder/CustomizeCkfinder"));
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
}
const FormCkEditor = forwardRef(function FormCkEditor(props: Props, ref?: ForwardedRef<any>) {
  const { id, label, value, setFieldValue, onChange, disabled, direction = "vertical", isRequired, errors, touched, className } = props;
  const Label = () => <div className={`text-medium-md ${isRequired ? "required-start" : ""}`}>{label}</div>;
  const Editor = useMemo(
    () => <CustomFormikEditor id={id} name={id} value={value} onChange={onChange} setFieldValue={setFieldValue} readonly={disabled} />,
    [disabled, id, setFieldValue, value],
  );
  const Error = () => errors && !!errors[id] && touched && touched[id] && <div className="block">{`${errors[id]}`}</div>;

  return direction === "vertical" ? (
    <div ref={ref} className="flex w-full flex-col items-start">
      <Label />
      {Editor}
      <Error />
    </div>
  ) : (
    <Row ref={ref}>
      <Col xs={24} lg={6}>
        <Label />
      </Col>
      <Col xs={24} lg={18} className={`${className}`}>
        {Editor}
        <Error />
      </Col>
    </Row>
  );
});
export default memo(FormCkEditor);
