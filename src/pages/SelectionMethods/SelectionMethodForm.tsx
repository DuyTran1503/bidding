import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik, FormikProps } from "formik";
import lodash from "lodash";
import { ISelectionMethodInitialState } from "@/services/store/selectionMethod/selectionMethod.slice";
import { ISelectionMethod } from "@/services/store/selectionMethod/selectionMethod.model";
import { Col, Form, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import { createSelectionMethod, updateSelectionMethod } from "@/services/store/selectionMethod/selectionMethod.thunk";
import FormCkEditor from "@/components/form/FormCkEditor";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { object, string } from "yup";
import { useViewport } from "@/hooks/useViewport";

interface ISelectionMethodFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>; // Add setVisible prop
  item?: ISelectionMethod;
}

const SelectionMethodForm = ({ visible, type, setVisible, item }: ISelectionMethodFormProps) => {
  const formikRef = useRef<FormikProps<ISelectionMethod>>(null);
  const { state, dispatch } = useArchive<ISelectionMethodInitialState>("selection_method");
  const { screenSize } = useViewport();
  const initialValues: ISelectionMethod = {
    id: item?.id || "",
    method_name: item?.method_name || "",
    description: item?.description || "",
    is_active: item?.is_active ? "1" : "0",
  };
  const schema = object().shape({
    method_name: string()
      .trim()
      .matches(/^[\p{L}0-9\s._`-]*$/u, "Không chứa ký tự đặc biệt không hợp lệ")
      .max(255, "Số ký tự tối đa là 255 ký tự"),
  });
  const handleSubmit = (data: ISelectionMethod) => {
    const body = {
      ...lodash.omit(data, "id", "key", "index"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(createSelectionMethod({ body }));
    } else if (type === EButtonTypes.UPDATE) {
      dispatch(updateSelectionMethod({ body, param: item?.id }));
    }
  };
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      setVisible(false);
    }
  }, [state.status]);
  return (
    <Dialog
      screenSize={screenSize}
      handleSubmit={() => {
        formikRef.current && formikRef.current.handleSubmit();
      }}
      visible={visible}
      setVisible={setVisible}
      title={
        type === EButtonTypes.CREATE
          ? "Tạo mới hình thức đấu thầu"
          : type === EButtonTypes.UPDATE
            ? "Cập nhật Tạo mới hình thức đấu thầu"
            : "Chi tiết Tạo mới hình thức đấu thầu"
      }
      footerContent={
        <div className="flex items-center justify-center gap-2">
          <Button key="cancel" text={"Hủy"} type="secondary" onClick={() => setVisible(false)} />
          {type !== EButtonTypes.VIEW && (
            <Button
              key="submit"
              kind="submit"
              text={"Lưu"}
              onClick={() => {
                formikRef.current && formikRef.current.handleSubmit();
              }}
            />
          )}
        </div>
      }
    >
      <Formik innerRef={formikRef} validationSchema={schema} initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form className="mt-3">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Tên hình thức đấu thầu"
                  value={values.method_name}
                  name="method_name"
                  error={touched.method_name ? errors.method_name : ""}
                  placeholder="Nhập tên hình thức đấu thầu..."
                  onChange={(value) => setFieldValue("method_name", value)}
                  onBlur={handleBlur}
                />
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Mô tả">
                  <FormCkEditor
                    id="description"
                    direction="vertical"
                    value={values.description}
                    setFieldValue={setFieldValue}
                    disabled={type === EButtonTypes.VIEW}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormSwitch
                  label="Trạng thái"
                  checked={values.is_active === "1"}
                  onChange={(value) => {
                    setFieldValue("is_active", value ? "1" : "0");
                  }}
                />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default SelectionMethodForm;
