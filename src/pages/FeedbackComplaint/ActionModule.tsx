import Button from "@/components/common/Button";
import Dialog from "@/components/dialog/Dialog";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSwitch from "@/components/form/FormSwitch";
import { useArchive } from "@/hooks/useArchive";
import { useViewport } from "@/hooks/useViewport";
import { IFeedbackComplaint } from "@/services/store/feedback_complaint/feedback_complaint.model";
import { IFeedbackComplaintInitialState } from "@/services/store/feedback_complaint/feedback_complaint.slice";
import { updateFeedbackComplaint } from "@/services/store/feedback_complaint/feedback_complaint.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { Col, Row } from "antd";
import { Form, Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Dispatch, SetStateAction, useRef } from "react";
import { object, string } from "yup";

interface IFeedbackComplaintsFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IFeedbackComplaint;
}

export interface IFeedbackComplaintValues {
  id: string;
  name: string;
  path?: File;
  is_active: string;
}

const ActionModule = ({ visible, type, setVisible, item }: IFeedbackComplaintsFormProps) => {
  const formikRef = useRef<FormikProps<IFeedbackComplaint>>(null);
  const { state, dispatch } = useArchive<IFeedbackComplaintInitialState>("feedback_complaint");

  const { screenSize } = useViewport();
  const initialValues: IFeedbackComplaint = {
    id: item?.id || "",
    project_id: item?.project_id || "",
    user_id: item?.user_id || "",
    content: item?.content || "",
    response_content: item?.response_content || "",
    is_active: item?.is_active || "",
  };

  const Schema = object().shape({
    response_content: string().required("Vui lòng nhập câu trả lời"),
  });

  const handleSubmit = (data: IFeedbackComplaint) => {
    const body = {
      ...lodash.omit(data, "id"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(updateFeedbackComplaint({ body: body }));
    } else if (type === EButtonTypes.UPDATE && item?.id) {
      //   const newData = item.path === body.path ? (({ ...rest }) => rest)(body) : body;
      //   dispatch(updateBidBond({ body: newData, param: item?.id }));
    }
  };

  return (
    <Dialog
      handleSubmit={() => {
        formikRef.current && formikRef.current.handleSubmit();
      }}
      screenSize={screenSize}
      visible={visible}
      setVisible={setVisible}
      title={type === EButtonTypes.UPDATE ? "Cập nhật phản hồi và khiếu nại" : "Chi tiết phản hồi và khiếu nại"}
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
        {({ values, errors, touched, setFieldValue }) => {
          return (
            <Form className="mt-3">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormInput type="text" isDisabled={true} label="Tên dự án" value={values.project_id} name="project_id" />
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormInput type="text" isDisabled={true} label="Tên người khiếu nại" value={values.user_id} name="user_id" />
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Nội dung khiéu nại">
                    <FormCkEditor
                      id="content"
                      direction="vertical"
                      value={values.content}
                      setFieldValue={setFieldValue}
                      disabled={type === EButtonTypes.VIEW}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Nhập nội dung phản hồi khiếu nại">
                    <FormCkEditor
                      id="response_content"
                      direction="vertical"
                      value={values.response_content}
                      setFieldValue={setFieldValue}
                      disabled={type === EButtonTypes.VIEW}
                      errors={touched.response_content && errors.response_content ? { response_content: errors.response_content } : undefined}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Trạng thái hoạt động">
                    <FormSwitch
                      checked={!!values.is_active ? true : false}
                      onChange={(value) => {
                        setFieldValue("is_active", value);
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default ActionModule;
