import { useArchive } from "@/hooks/useArchive";
import FormInput from "@/components/form/FormInput";
import { Form, Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Col, Row } from "antd";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { useViewport } from "@/hooks/useViewport";
import { ITask } from "@/services/store/task/task.model";
import { ITaskInitialState } from "@/services/store/task/task.slice";
import { levelTaskEnumArray, mappingLevelTask } from "@/shared/enums/level";
import { createTask, updateTask } from "@/services/store/task/task.thunk";
import FormSelect from "@/components/form/FormSelect";
import { IOption } from "@/shared/utils/shared-interfaces";
import { convertDataOptions } from "../Project/helper";
import { IEmployeeInitialState } from "@/services/store/employee/employee.slice";
import { getListEmployee } from "@/services/store/employee/employee.thunk";
import { array, object, string } from "yup";
import FormGroup from "@/components/form/FormGroup";
import FormTreeSelect from "@/components/form/FormTreeSelect";
import FormCkEditor from "@/components/form/FormCkEditor";

interface ITaskFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: ITask;
  treeData?: any[];
}

const TaskForm = ({ visible, type, setVisible, item, treeData }: ITaskFormProps) => {
  const formikRef = useRef<FormikProps<ITask>>(null);
  const { state, dispatch } = useArchive<ITaskInitialState>("task");
  const { state: stateEmployee, dispatch: dispatchEmployee } = useArchive<IEmployeeInitialState>("employee");
  const { screenSize } = useViewport();
  const initialValues: ITask = {
    id: item?.id || "",
    name: item?.name || "",
    project_id: item?.project?.name || undefined,
    employee_id: item?.employees?.map((item: any) => item.id) || [],
    description: item?.description ?? "",
    difficulty_level: item?.difficulty_level || undefined,
    code: item?.code || "",
  };

  const stringRegex = /^[\p{L}0-9\s._,`-]*$/u;
  const Schema = object().shape({
    name: string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt").required("Vui lòng không để trống ô này"),
    code: string().trim().required("Vui lòng nhập mã công việc"),
    employee_id: array().min(1, "Vui lòng chọn ít nhất 1 nhân viên").required("Vui lòng chọn 1 hoặc nhiều nhân viên"),
    project_id: string().trim().required("Vui lòng không để trống trường này"),
    difficulty_level: string().trim().required("Vui lòng chọn mức độ làm việc"),
  });

  const handleSubmit = async (data: ITask) => {
    try {
      const body = {
        ...lodash.omit(data, "key", "index"),
      };

      if (type === EButtonTypes.CREATE) {
        await dispatch(createTask({ body: body as Omit<ITask, "id"> }));
      } else if (type === EButtonTypes.UPDATE && item?.id) {
        await dispatch(updateTask({ body, param: item?.id }));
      }
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      setVisible(false);
    }
  }, [state.status]);

  useEffect(() => {
    !!visible && dispatchEmployee(getListEmployee());
  }, [visible]);

  const optionLevel: IOption[] = levelTaskEnumArray.map((e) => ({
    label: mappingLevelTask[e],
    value: e,
  }));

  return (
    <Dialog
      screenSize={screenSize}
      handleSubmit={() => {
        if (formikRef.current) {
          formikRef.current.validateForm().then((errors) => {
            if (Object.keys(errors).length === 0) {
              formikRef.current?.handleSubmit();
            }
          });
        }
      }}
      visible={visible}
      setVisible={setVisible}
      title={type === EButtonTypes.CREATE ? "Tạo mới công việc" : type === EButtonTypes.UPDATE ? "Cập nhật công việc" : "Chi tiết công việc"}
      footerContent={
        <div className="flex items-center justify-center gap-2">
          <Button key="cancel" text={"Hủy"} type="secondary" onClick={() => setVisible(false)} />
          {type !== EButtonTypes.VIEW && (
            <Button
              key="submit"
              kind="submit"
              text={"Lưu"}
              onClick={() => {
                if (formikRef.current) {
                  formikRef.current.validateForm().then((errors) => {
                    if (Object.keys(errors).length === 0) {
                      formikRef.current?.handleSubmit();
                    }
                  });
                }
              }}
            />
          )}
        </div>
      }
    >
      <Formik validationSchema={Schema} innerRef={formikRef} initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
        {({ values, handleBlur, setFieldValue, touched, errors }) => {
          return (
            <Form className="mt-3">
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-2">
                  <FormGroup title="Tên công viêc" required>
                    <FormInput
                      type="text"
                      isDisabled={type === "view"}
                      value={values.name}
                      error={touched.name || !values.name ? errors.name : ""}
                      name="name"
                      placeholder="Nhập tên công viêc..."
                      onChange={(value) => setFieldValue("name", value)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-2">
                  <FormGroup title="Mã công việc" required>
                    <FormInput
                      type="text"
                      isDisabled={type === "view"}
                      value={values.code}
                      error={touched.code || !values.code ? errors.code : ""}
                      name="code"
                      placeholder="Nhập tên công việc..."
                      onChange={(value) => setFieldValue("code", value)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-2">
                  <FormGroup title="Dự án" required>
                    <FormTreeSelect
                      isDisabled={type !== "create"}
                      value={values?.project_id as any}
                      placeholder="Nhập tên dự án..."
                      error={touched.project_id || !values?.project_id ? errors.project_id : ""}
                      onChange={(value) => {
                        setFieldValue("project_id", value as string);
                      }}
                      treeData={treeData!}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-2">
                  <FormGroup title="Nhân viên thực hiện" required>
                    <FormSelect
                      isDisabled={type === "view"}
                      placeholder="Chọn nhân viên..."
                      id="employee_id"
                      isMultiple
                      error={touched.employee_id || values?.employee_id.length <= 0 ? errors.employee_id : ""}
                      value={values?.employee_id}
                      options={convertDataOptions(stateEmployee?.getListEmployee)}
                      onChange={(e) => setFieldValue("employee_id", e)}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-2">
                  <FormGroup title="Mức độ công việc" required>
                    <FormSelect
                      isDisabled={type === "view"}
                      value={values.difficulty_level}
                      options={optionLevel}
                      error={touched.difficulty_level || !values.difficulty_level ? errors.difficulty_level : ""}
                      id="difficulty_level"
                      placeholder="Chọn mức độ..."
                      onChange={(value) => setFieldValue("difficulty_level", value)}
                    />
                  </FormGroup>
                </Col>

                <Col xs={24} sm={24} md={24} xl={24} className="mb-2">
                  <FormGroup title="Ghi chú">
                    <FormCkEditor
                      id="description"
                      direction="vertical"
                      value={values.description!}
                      setFieldValue={setFieldValue}
                      disabled={type === "view"}
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

export default TaskForm;
