import FormCkEditor from "@/components/form/FormCkEditor";
import FormDate from "@/components/form/FormDate";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { useArchive } from "@/hooks/useArchive";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { ITask } from "@/services/store/task/task.model";
import { ITaskInitialState } from "@/services/store/task/task.slice";
import { getListTask, getTaskOfProject } from "@/services/store/task/task.thunk";
import { IWorkProgressInitialState } from "@/services/store/workProgresses/workProgresses.slice";
import { createWorkProgress, updateWorkProgress } from "@/services/store/workProgresses/workProgresses.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { mappingTypeFeedback, typeTypeFeedbackEnumArray } from "@/shared/enums/typeFeedback";
import { convertToNumberFromMoney } from "@/shared/utils/common/convertMoney";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import lodash from "lodash";
import { useEffect, useState } from "react";
import { convertDataOptions } from "../Project/helper";
import { formatTreeSelect } from "@/shared/enums/formatTreeSelect";
import FormTreeSelect from "@/components/form/FormTreeSelect";
import { schemaWorkProgresses } from "@/shared/Schema/schema";

interface IWorkProgressFormProps {
  formikRef?: FormikRefType<IWorkProgressInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  workProgress?: IWorkProgressInitialValues;
}

export interface IWorkProgressInitialValues {
  id?: string;
  project_id?: string;
  task_ids?: number[];
  name: string;
  expense?: number | string;
  progress: string;
  start_date: string | Date;
  end_date: string | Date;
  feedback: string;
  description: string;
  task?: ITask[];
}
export const optionWorkProgress = typeTypeFeedbackEnumArray.map((item) => ({
  value: item,
  label: mappingTypeFeedback[item],
}));
const WorkProgressForm = ({ formikRef, type, workProgress }: IWorkProgressFormProps) => {
  const { state, dispatch: dispatchWorkProgress } = useArchive<IWorkProgressInitialState>("work_progress");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateTask, dispatch: dispatchTask } = useArchive<ITaskInitialState>("task");
  const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
  useEffect(() => {
    const formattedData = formatTreeSelect(stateProject.listProjects as any);
    setTreeData(formattedData);
  }, [stateProject.listProjects]);

  const initialValues: IWorkProgressInitialValues = {
    id: workProgress?.id ?? "",
    name: workProgress?.name ?? "",
    expense: (() => {
      const expenseValue = parseFloat(workProgress?.expense as string);
      return isNaN(expenseValue) ? undefined : new Intl.NumberFormat("en-US").format(Math.floor(expenseValue));
    })(),
    progress: workProgress?.progress ?? "",
    start_date: workProgress?.start_date ?? "",
    end_date: workProgress?.end_date ?? "",
    feedback: workProgress?.feedback ?? "",
    description: workProgress?.description ?? "",
    project_id: workProgress?.project_id ?? undefined,
    task_ids: workProgress?.task?.map((item) => +item.id) ?? [],
  };

  const tasks = Array.isArray(stateTask?.listTasks) ? stateTask.listTasks : [];

  useEffect(() => {
    dispatchProject(getListProject());
    dispatchTask(getListTask());
  }, []);

  return (
    <Formik
      enableReinitialize
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={schemaWorkProgresses}
      onSubmit={(data, { setErrors }: any) => {
        const body = {
          ...data,
          expense: +convertToNumberFromMoney(data.expense as string),
        };
        if (type === EPageTypes.CREATE) {
          dispatchWorkProgress(createWorkProgress({ body: lodash.omit(body, "id") }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        } else if (type === EPageTypes.UPDATE && workProgress?.id) {
          dispatchWorkProgress(updateWorkProgress({ body: lodash.omit(body, "id"), param: workProgress.id }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
          <Form>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Tên tiến độ" required>
                  <FormInput
                    placeholder="Nhập..."
                    name="name"
                    isDisabled={type === EPageTypes.VIEW}
                    value={values.name}
                    error={touched.name || !values.name ? errors.name : ""}
                    onChange={(e) => setFieldValue("name", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Dự án" required>
                  <FormTreeSelect
                    isDisabled={type === "view"}
                    value={values?.project_id as any}
                    placeholder="Nhập tên dự án..."
                    error={touched.project_id || !values.project_id ? errors.project_id : ""}
                    onChange={(value) => {
                      const projectId = value as string;
                      setFieldValue("project_id", projectId);

                      // Gọi hàm getTaskOfProject sau khi đặt project_id
                      if (projectId) {
                        dispatchWorkProgress(getTaskOfProject(projectId));
                      }
                    }}
                    treeData={treeData}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Tiến độ" required>
                  <FormInput
                    placeholder="Nhập..."
                    name="progress"
                    isDisabled={type === EPageTypes.VIEW}
                    value={values.progress}
                    error={touched.progress || !values.progress ? errors.progress : ""}
                    onChange={(e) => setFieldValue("progress", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Nhiệm vụ" required>
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn nhiệm vụ..."
                    isMultiple
                    value={values.task_ids}
                    error={
                      touched.task_ids || state.getTaskOfProject?.length === 0
                        ? "Dự án chưa có nhiệm vụ vui lòng chọn dự án khác"
                        : values.task_ids?.length === 0
                          ? errors.task_ids
                          : ""
                    }
                    id="task_ids"
                    onChange={(e) => {
                      setFieldValue("task_ids", e);
                    }}
                    options={convertDataOptions(state.getTaskOfProject as any)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Nhận xét" required>
                  <FormSelect
                    placeholder="Nhận xét..."
                    isDisabled={type === EPageTypes.VIEW}
                    id="feedback"
                    options={optionWorkProgress}
                    value={values.feedback || undefined}
                    error={touched.feedback || !values.feedback ? errors.feedback : ""}
                    onChange={(e) => setFieldValue("feedback", e)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Chi phí" required>
                  <FormInput
                    type="text"
                    placeholder="Nhập chi phí..."
                    isDisabled={type === EPageTypes.VIEW}
                    name="expense"
                    value={values.expense}
                    error={touched.expense || !values.expense ? errors.expense : ""}
                    onChange={(e) => {
                      setFieldValue("expense", e);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Ngày bắt đâu" required>
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    error={touched.start_date ? errors.start_date : ""}
                    value={values.start_date ? dayjs(values.start_date) : null}
                    onChange={(date) => setFieldValue("start_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Ngày kết thúc" required>
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    minDate={
                      values.start_date ? (dayjs(values.start_date).isValid() ? dayjs(values.start_date).add(1, "day") : undefined) : undefined
                    }
                    error={touched.end_date ? errors.end_date : ""}
                    value={values.end_date ? dayjs(values.end_date) : null}
                    onChange={(date) => setFieldValue("end_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={24} xl={24}>
                <FormGroup title="Mô tả">
                  <FormCkEditor
                    id="description"
                    disabled={type === EPageTypes.VIEW}
                    value={values.description ?? ""}
                    onChange={(e) => setFieldValue("description", e)}
                  />
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
