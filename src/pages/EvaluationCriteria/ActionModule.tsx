import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Form, Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { useViewport } from "@/hooks/useViewport";
import FormSelect from "@/components/form/FormSelect";
import { convertDataOptions } from "../Project/helper";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import FormCkEditor from "@/components/form/FormCkEditor";
import { IEvaluationCriteria } from "@/services/store/evaluation/evaluation.model";
import { IEvaluationCriteriaInitialState } from "@/services/store/evaluation/evaluation.slice";
import { createEvaluation, updateEvaluation } from "@/services/store/evaluation/evaluation.thunk";

interface IEvaluationCriteriaFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IEvaluationCriteria;
}

const ActionModuleEvaluationCriteria = ({ visible, type, setVisible, item }: IEvaluationCriteriaFormProps) => {
  const formikRef = useRef<FormikProps<IEvaluationCriteria>>(null);
  const { state, dispatch } = useArchive<IEvaluationCriteriaInitialState>("evaluation");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");

  const { screenSize } = useViewport();
  const initialValues: IEvaluationCriteria = {
    id: item?.id || "",
    project_id: item?.project_id || undefined,
    is_active: item?.is_active ? "1" : "0",
    name: item?.name || "",
    weight: item?.weight || "",
    description: item?.description || "",
  };
  const handleSubmit = (data: IEvaluationCriteria) => {
    const body = {
      ...lodash.omit(data, "key", "index", "id"),
    };
    if (type === EButtonTypes.CREATE) {
      return dispatch(createEvaluation({ body: body }));
    }
    if (type === EButtonTypes.UPDATE && item?.id) {
      return dispatch(updateEvaluation({ body: body, param: item?.id }));
    }
  };
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      setVisible(false);
    }
  }, [state.status]);
  useEffect(() => {
    if (!!visible) {
      dispatchProject(getListProject());
    }
  }, [visible]);
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
          ? "Tạo mới tiêu chi đánh giá"
          : type === EButtonTypes.UPDATE
            ? "Cập nhật Tạo mới tiêu chi đánh giá"
            : "Chi tiết tiêu chi đánh giá"
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
      <Formik innerRef={formikRef} initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
        {({ values, errors, handleBlur, setFieldValue }) => {
          return (
            <Form className="mt-3">
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormSelect
                    isDisabled={type === "view"}
                    label="Tên dự án"
                    value={stateProject.listProjects?.find((item) => +item.id === +values?.project_id!)?.name ?? undefined}
                    id="project_id"
                    placeholder="Nhập tên dự án..."
                    onChange={(value) => setFieldValue("project_id", value)}
                    options={convertDataOptions(stateProject.listProjects || [])}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    label="Tên tiêu chí đánh giá"
                    value={values.name}
                    name="name"
                    placeholder="Nhập tên tiêu chí đánh giá..."
                    onChange={(value) => setFieldValue("name", value)}
                    onBlur={handleBlur}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    label="Trọng số đánh giá"
                    value={values.weight}
                    name="weight"
                    placeholder="Nhập trọng số đánh giá..."
                    onChange={(value) => setFieldValue("weight", value)}
                    onBlur={handleBlur}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormSwitch
                    label="Trạng thái"
                    checked={values.is_active === "1"}
                    onChange={(value) => {
                      setFieldValue("is_active", value ? "1" : "0");
                    }}
                  />
                </Col>
                <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                  <FormGroup title="Mô Tả">
                    <FormCkEditor label="Mô tả" id="description" value={values.description ?? ""} onChange={(e) => setFieldValue("description", e)} />
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

export default ActionModuleEvaluationCriteria;
