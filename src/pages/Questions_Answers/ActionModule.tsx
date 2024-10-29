import Button from "@/components/common/Button";
import Dialog from "@/components/dialog/Dialog";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSwitch from "@/components/form/FormSwitch";
import { useArchive } from "@/hooks/useArchive";
import { useViewport } from "@/hooks/useViewport";
import { IQuestionsAnswers } from "@/services/store/questions_answers/questions_answers.model";
import { IQuestionsAnswersInitialState } from "@/services/store/questions_answers/questions_answers.slice";
import { updateQuestionAnswer } from "@/services/store/questions_answers/questions_answers.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { Col, Row } from "antd";
import { Form, Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Dispatch, SetStateAction, useRef } from "react";
import { object, string } from "yup";

interface IQuestionsAnswersFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IQuestionsAnswers;
}

export interface IQuestionsAnswersValues {
  id: string;
  name: string;
  path?: File;
  is_active: string;
}

const ActionModule = ({ visible, type, setVisible, item }: IQuestionsAnswersFormProps) => {
  const formikRef = useRef<FormikProps<IQuestionsAnswers>>(null);
  const { dispatch } = useArchive<IQuestionsAnswersInitialState>("questions_answers");

  const { screenSize } = useViewport();
  const initialValues: IQuestionsAnswers = {
    id: item?.id || "",
    project_id: item?.project_id || "",
    question_content: item?.question_content || "",
    answer_content: item?.answer_content || "",
    asked_by: item?.asked_by || "",
    answer_by: item?.answer_by || "",
    is_active: item?.is_active || "",
  };

  const Schema = object().shape({
    answer_content: string().required("Vui lòng nhập câu trả lời"),
    answer_by: string().required("Vui lòng nhập tên người trả lời"),
  });

  const handleSubmit = (data: IQuestionsAnswers) => {
    const body = {
      ...lodash.omit(data, "id"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(updateQuestionAnswer({ body: body }));
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
      title={type === EButtonTypes.UPDATE ? "Cập nhật câu hỏi" : "Chi tiết câu hỏi"}
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
        {({ values, errors, touched, setFieldValue, handleBlur }) => {
          return (
            <Form className="mt-3">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormInput type="text" isDisabled={true} label="Người hỏi" value={values.asked_by} name="asked_by" />
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    label="Người trả lời"
                    value={values.answer_by}
                    name="answer_by"
                    error={touched.answer_by ? errors.answer_by : ""}
                    onChange={(value) => setFieldValue("answer_by", value)}
                    onBlur={handleBlur}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Nhập nội dung câu trả lời">
                    <FormCkEditor
                      id="answer_content"
                      direction="vertical"
                      value={values.answer_content}
                      setFieldValue={setFieldValue}
                      disabled={type === EButtonTypes.VIEW}
                      errors={touched.answer_content && errors.answer_content ? { answer_content: errors.answer_content } : undefined}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Nhập nội dung câu trả lời">
                    <FormCkEditor
                      id="answer_content"
                      direction="vertical"
                      value={values.answer_content}
                      setFieldValue={setFieldValue}
                      disabled={type === EButtonTypes.VIEW}
                      errors={touched.answer_content && errors.answer_content ? { answer_content: errors.answer_content } : undefined}
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
