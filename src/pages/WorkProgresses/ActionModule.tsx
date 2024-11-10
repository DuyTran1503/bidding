import FormCkEditor from "@/components/form/FormCkEditor";
import FormDate from "@/components/form/FormDate";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { useArchive } from "@/hooks/useArchive";
import { resetMessageError } from "@/services/store/enterprise/enterprise.slice";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { ITaskInitialState } from "@/services/store/task/task.slice";
import { IWorkProgressInitialState } from "@/services/store/workProgress/workProgress.slice";
import { createWorkProgress, updateWorkProgress } from "@/services/store/workProgress/workProgress.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { TypeFeedback } from "@/shared/enums/typeFeedback";
import { convertEnum } from "@/shared/utils/common/convertEnum";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import lodash from "lodash";
import { useEffect } from "react";
import { object, string } from "yup";
import { convertDataOptions } from "../Project/helper";
import { getListTask } from "@/services/store/task/task.thunk";

interface IWorkProgressFormProps {
  formikRef?: FormikRefType<IWorkProgressInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  workProgress?: IWorkProgressInitialValues;
}

export interface IWorkProgressInitialValues {
  id?: string;
  project_id: string;
  task_ids: string;
  name: string;
  expense: number | string;
  progress: string;
  start_date: string | Date;
  end_date: string | Date;
  feedback: string;
  description: string;
}

const WorkProgressForm = ({ formikRef, type, workProgress }: IWorkProgressFormProps) => {
  const { dispatch: dispatchWorkProgress } = useArchive<IWorkProgressInitialState>("work_progress");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  // const { state: stateTask, dispatch: dispatchTask } = useArchive<ITaskInitialState>("task");

  const initialValues: IWorkProgressInitialValues = {
    id: workProgress?.id ?? "",
    name: workProgress?.name ?? "",
    expense: workProgress?.expense ?? "",
    progress: workProgress?.progress ?? "",
    start_date: workProgress?.start_date ?? "",
    end_date: workProgress?.end_date ?? "",
    feedback: workProgress?.feedback ?? "",
    description: workProgress?.description ?? "",
    project_id: workProgress?.project_id ?? "",
    task_ids: workProgress?.task_ids ?? "",
  };
  const Schema = object().shape({
    name: string().trim().required("Vui lòng không để trống trường này"),
    expense: string().trim().required("Vui lòng không để trống trường này"),
    progress: string().trim().required("Vui lòng không để trống trường này"),
    start_date: string().trim().required("Vui lòng không để trống trường này"),
    feedback: string().trim().required("Vui lòng không để trống trường này"),
    end_date: string().trim().required("Vui lòng không để trống trường này"),
    description: string().trim().required("Vui lòng không để trống trường này"),
    project_id: string().trim().required("Vui lòng không để trống trường này"),
    // task_ids: string().trim().required("Vui lòng không để trống trường này"),
  });
  useEffect(() => {
    return () => {
      dispatchWorkProgress(resetMessageError());
    };
  }, []);
  useEffect(() => {
    dispatchProject(getListProject());
    // dispatchTask(getListTask())
  }, []);

  return (
    <Formik
      enableReinitialize
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={(data) => {
        if (type === EPageTypes.CREATE) {
          dispatchWorkProgress(createWorkProgress({ body: lodash.omit(data, "id") }));
        } else if (type === EPageTypes.UPDATE && workProgress?.id) {
          dispatchWorkProgress(updateWorkProgress({ body: lodash.omit(data, "id"), param: workProgress.id }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
          <Form>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Tên tiến độ">
                  <FormInput
                    placeholder="Nhập..."
                    name="name"
                    value={values.name}
                    error={touched.name ? errors.name : ""}
                    onChange={(e) => setFieldValue("name", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Dự án">
                  <FormSelect
                    placeholder="Chọn dự án..."
                    id="project_id"
                    value={values.project_id as string}
                    error={touched.project_id ? errors.project_id : ""}
                    options={convertDataOptions(stateProject?.listProjects || [])}
                    onChange={(e) => setFieldValue("project_id", e)}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Tiến độ">
                  <FormInput
                    placeholder="Nhập..."
                    name="progress"
                    value={values.progress}
                    error={touched.progress ? errors.progress : ""}
                    onChange={(e) => setFieldValue("progress", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              {/* <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Nhiệm vụ">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn nhiệm vụ..."
                    isMultiple
                    value={values.task_ids}
                    id="task_ids"
                    onChange={(e) => {
                      setFieldValue("task_ids", e);
                    }}
                    options={convertDataOptions(stateTask?.listTasks || [])}
                  />
                </FormGroup>
              </Col> */}
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Chi phí">
                  <FormInput
                    placeholder="Nhập..."
                    name="expense"
                    value={values.expense}
                    error={touched.expense ? errors.expense : ""}
                    onChange={(e) => setFieldValue("expense", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Nhận xét">
                  <FormSelect
                    label="Loại nguồn tài trợ"
                    placeholder="Chọn loại nguồn tài trợ..."
                    isDisabled={type === EPageTypes.VIEW}
                    id="feedback"
                    options={convertEnum(TypeFeedback)}
                    value={values.feedback || undefined}
                    error={touched.feedback ? errors.feedback : ""}
                    onChange={(e) => setFieldValue("feedback", e)}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Ngày bắt đâu">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    value={values.start_date ? dayjs(values.start_date) : null}
                    onChange={(date) => setFieldValue("start_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Ngày kết thúc">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    value={values.end_date ? dayjs(values.end_date) : null}
                    onChange={(date) => setFieldValue("end_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Mô tả">
                  <FormCkEditor id="description" value={values.description ?? ""} onChange={(e) => setFieldValue("description", e)} />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default WorkProgressForm;
