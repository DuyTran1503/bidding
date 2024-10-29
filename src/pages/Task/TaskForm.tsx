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
import { IAccountInitialState } from "@/services/store/account/account.slice";
import { getListStaff } from "@/services/store/account/account.thunk";

interface ITaskFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: ITask;
}

const TaskForm = ({ visible, type, setVisible, item }: ITaskFormProps) => {
  const formikRef = useRef<FormikProps<ITask>>(null);
  const { state, dispatch } = useArchive<ITaskInitialState>("task");
  const { state: stateStaff, dispatch: dispatchStaff } = useArchive<IAccountInitialState>("account");

  const { screenSize } = useViewport();
  const initialValues: ITask = {
    id: item?.id || "",
    name: item?.name || "",
    employee_id: item?.employee_id || [],
    document: item?.document ?? undefined,
    difficulty_level: item?.difficulty_level || undefined,
    code: item?.code || "",
  };
  const handleSubmit = (data: ITask) => {
    const body = {
      ...lodash.omit(data, "key", "index"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(createTask({ body: body as Omit<ITask, "id"> }));
    } else if (type === EButtonTypes.UPDATE && item?.id) {
      const newData = item.document === body.document ? (({ ...rest }) => rest)(body) : body;
      dispatch(updateTask({ body: newData, param: item?.id }));
    }
  };
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      setVisible(false);
    }
  }, [state.status]);

  useEffect(() => {
    dispatchStaff(getListStaff());
  }, [visible]);

  const optionLevel: IOption[] = levelTaskEnumArray.map((e) => ({
    label: mappingLevelTask[e],
    value: e,
  }));
  return (
    <Dialog
      screenSize={screenSize}
      handleSubmit={() => {
        formikRef.current && formikRef.current.handleSubmit();
      }}
      visible={visible}
      setVisible={setVisible}
      title={
        type === EButtonTypes.CREATE ? "Tạo mới công tác" : type === EButtonTypes.UPDATE ? "Cập nhật Tạo mới công tác" : "Chi tiết Tạo mới công tác"
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
        {({ values, handleBlur, setFieldValue }) => (
          <Form className="mt-3">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Tên Task"
                  value={values.name}
                  name="name"
                  placeholder="Nhập tên Task..."
                  onChange={(value) => setFieldValue("name", value)}
                  onBlur={handleBlur}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Mã công việc"
                  value={values.code}
                  name="code"
                  placeholder="Nhập tên công việc..."
                  onChange={(value) => setFieldValue("code", value)}
                  onBlur={handleBlur}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSelect
                  label="Công ty"
                  placeholder="Chọn công ty..."
                  id="employees"
                  isMultiple
                  value={values?.employee_id}
                  options={convertDataOptions(stateStaff?.getListStaff)}
                  onChange={(e) => setFieldValue("employee_id", e)}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSelect
                  isDisabled={type === "view"}
                  label="Task làm việc"
                  value={values.difficulty_level}
                  options={optionLevel}
                  id="difficulty_level"
                  placeholder="Chọn mức độ..."
                  onChange={(value) => setFieldValue("difficulty_level", value)}
                />
              </Col>

              {/* <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Hồ sơ nhân viên">
                  <FormUploadFile
                    isMultiple={false}
                    value={values.document}
                    onChange={(e: any) => {
                      setFieldValue("document", e);
                    }}
                  />
                </FormGroup>
              </Col> */}
            </Row>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default TaskForm;
