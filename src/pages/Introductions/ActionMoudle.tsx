import Button from "@/components/common/Button";
import Dialog from "@/components/dialog/Dialog";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormSwitch from "@/components/form/FormSwitch";
import { useArchive } from "@/hooks/useArchive";
import { useViewport } from "@/hooks/useViewport";
import { IIntroduction } from "@/services/store/introduction/introduction.moldel";
import { IIntroductionInitialState } from "@/services/store/introduction/introduction.slice";
import { createIntroduction, updateIntroduction } from "@/services/store/introduction/introduction.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { Col, Form, Row } from "antd";
import { Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { object, string } from "yup";

interface IIntroductionFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IIntroduction;
}

const IntroductionForm = ({ visible, type, setVisible, item }: IIntroductionFormProps) => {
  const formikRef = useRef<FormikProps<IIntroduction>>(null);
  const { state, dispatch } = useArchive<IIntroductionInitialState>("introduction");
  const { screenSize } = useViewport();

  const initialValues: IIntroduction = {
    id: item?.id ?? "", // kieu du lieu bat buoc
    introduction: item?.introduction ?? "",
    is_use: item?.is_use ?? "0",
  };
  const handleSubmit = (data: IIntroduction, { setErrors }: any) => {
    const body = {
      ...lodash.omit(data, "id", "key", "index"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(createIntroduction({ body }))
        .unwrap()
        .catch((error) => {
          const apiErrors = error?.errors || {};
          setErrors(apiErrors);
        });
    } else if (type === EButtonTypes.UPDATE) {
      dispatch(updateIntroduction({ body, param: item?.id }));
    }
  };

  const Schema = object().shape({
    introduction: string().trim().required("Vui lòng không để trống trường này"),
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
      title={type === EButtonTypes.CREATE ? "Tạo mới giới thiệu" : type === EButtonTypes.UPDATE ? "Cập nhật giới thiệu" : "Chi tiết giới thiệu"}
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
        {({ values, setFieldValue }) => (
          <Form className="mt-3">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24} xl={24}>
                <FormGroup title="Trạng thái">
                  <FormSwitch
                    isDisabled={type === "view"}
                    checked={values.is_use === "1"}
                    onChange={(value) => {
                      setFieldValue("is_use", value ? "1" : "0");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={24} xl={24}>
                <FormGroup title="Giới thiệu">
                  <FormCkEditor
                    id="introduction"
                    direction="vertical"
                    value={values.introduction}
                    setFieldValue={setFieldValue}
                    disabled={type === EButtonTypes.VIEW}
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

export default IntroductionForm;
