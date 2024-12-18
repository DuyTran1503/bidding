import Button from "@/components/common/Button";
import Dialog from "@/components/dialog/Dialog";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormSwitch from "@/components/form/FormSwitch";
import { useArchive } from "@/hooks/useArchive";
import { useViewport } from "@/hooks/useViewport";
import { IInstruct } from "@/services/store/instruct/instruct.mode";
import { IInstructInitialState } from "@/services/store/instruct/instruct.slice";
import { createInstruct, updateInstruct } from "@/services/store/instruct/instruct.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { Col, Form, Row } from "antd";
import { Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { object, string } from "yup";

interface IInstructFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IInstruct;
}

const InstructForm = ({ visible, type, setVisible, item }: IInstructFormProps) => {
  const formikRef = useRef<FormikProps<IInstruct>>(null);
  const { state, dispatch } = useArchive<IInstructInitialState>("instruct");
  const { screenSize } = useViewport();

  const initialValues: IInstruct = {
    id: item?.id ?? "", // kieu du lieu bat buoc
    instruct: item?.instruct ?? "",
    is_use: item?.is_use ?? "0",
  };
  const handleSubmit = (data: IInstruct, { setErrors }: any) => {
    const body = {
      ...lodash.omit(data, "id", "key", "index"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(createInstruct({ body }))
        .unwrap()
        .catch((error) => {
          const apiErrors = error?.errors || {};
          setErrors(apiErrors);
        });
    } else if (type === EButtonTypes.UPDATE) {
      dispatch(updateInstruct({ body, param: item?.id }));
    }
  };

  const Schema = object().shape({
    instruct: string().trim().required("Vui lòng không để trống trường này"),
  });
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
      title={type === EButtonTypes.CREATE ? "Tạo mới hướng dẫn" : type === EButtonTypes.UPDATE ? "Cập nhật hướng dẫn" : "Chi tiết hướng dẫn"}
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
      <Formik innerRef={formikRef} initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit} validationSchema={Schema}>
        {({ values, setFieldValue, errors, touched }) => (
          <Form className="mt-3">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24} xl={24}>
                <FormGroup title="Trạng thái">
                  <FormSwitch
                    checked={values.is_use === "1"}
                    onChange={(value) => {
                      setFieldValue("is_use", value ? "1" : "0");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={24} xl={24}>
                <FormGroup title="Hướng dẫn" required>
                  <FormCkEditor
                    id="instruct"
                    direction="vertical"
                    value={values.instruct}
                    setFieldValue={setFieldValue}
                    disabled={type === EButtonTypes.VIEW}
                    error={touched.instruct ? errors.instruct : ""}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default InstructForm;
