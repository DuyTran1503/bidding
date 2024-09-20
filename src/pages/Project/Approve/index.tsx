import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { INewProject, IProject } from "@/services/store/project/project.model";
import { IProjectInitialState, resetStatus } from "@/services/store/project/project.slice";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ActionModule from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import { approveProject, getProjectById } from "@/services/store/project/project.thunk";
import { IResponse } from "@/shared/utils/shared-interfaces";
import { AsyncThunkAction } from "@reduxjs/toolkit";
import { AsyncThunkConfig } from "node_modules/@reduxjs/toolkit/dist/createAsyncThunk";
import { MdOutlineEditOff } from "react-icons/md";
import Dialog from "@/components/dialog/Dialog";
import Button from "@/components/common/Button";
import { useViewport } from "@/hooks/useViewport";
import { Col, Row } from "antd";
import FormGroup from "@/components/form/FormGroup";
import FormSelect from "@/components/form/FormSelect";
import { STATUS_PROJECT, STATUS_PROJECT_ARRAY } from "@/shared/enums/statusProject";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormInput from "@/components/form/FormInput";
import { mixed, object, string } from "yup";

interface IApprove {
  status: STATUS_PROJECT;
  decision_number_approve: string;
  notes?: string;
  initialStatus?: string;
}

const ApproveProject = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<INewProject>>(null);
  const { state, dispatch } = useArchive<IProjectInitialState>("project");
  const [data, setData] = useState<INewProject>();
  const { id } = useParams();
  const [visible, setVisible] = useState(false);
  const { screenSize } = useViewport();
  const [is_approve, setIsApprove] = useState(true);
  useFetchStatus({
    module: "project",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/project",
      },
      error: {
        message: state.message,
      },
    },
  });

  const validationSchema = object().shape({
    status: mixed()
      .test("is-status-changed", "Vui lòng chọn trạng thái khác", function (value) {
        // Only apply this validation when is_approve is true
        if (!is_approve) return true;

        const initialStatus = this.parent.initialStatus;
        return value !== initialStatus;
      })
      .required("Không để trống trường này"),

    decision_number_approve: string()
      .trim()
      .when("status", (_, schema) => {
        return is_approve ? schema.required("Không để trống trường này") : schema.notRequired();
      }),
  });
  const initialValues: IApprove = {
    status: data?.status || STATUS_PROJECT.AWAITING,
    decision_number_approve: "",
    notes: "",
    initialStatus: (data?.status as any) || "",
  };
  useEffect(() => {
    if (id) {
      dispatch(getProjectById(id));
    }
  }, [id]);
  useEffect(() => {
    if (!!state.project) {
      setData(state.project);
    }
  }, [JSON.stringify(state.project)]);
  return (
    <>
      <Heading
        title="Tạo mới "
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Thoát",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/project");
            },
          },
          //   {
          //     isLoading: state.status === EFetchStatus.PENDING,
          //     text: "Trả về",
          //     icon: <MdOutlineEditOff className="text-[18px]" />,
          //     type: "third",
          //     onClick: () => {
          //       setVisible(true);
          //     },
          //   },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Phê duyệt",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              setVisible(true);
            },
          },
        ]}
      />
      <ActionModule type={EPageTypes.APPROVE} formikRef={formikRef} project={data} />
      <Dialog visible={visible} setVisible={setVisible} title=" Phê duyệt dự án" footerContent={null} screenSize={screenSize}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (id) {
              console.log(values);

              //   dispatch(approveProject({ body: values, param: id }));
            }
          }}
          enableReinitialize
        >
          {({ values, errors, touched, handleBlur, setFieldValue, handleSubmit }) => {
            console.log(errors);

            return (
              <Form onSubmit={handleSubmit}>
                <Row gutter={[24, 12]}>
                  <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                    <FormGroup title="Số quyết định phê duyệt">
                      <FormInput
                        label="Số quyết định phê duyệt"
                        placeholder="Nhập số quyết định phê duyệt..."
                        name="decision_number_approve"
                        value={values.decision_number_approve}
                        error={touched.decision_number_approve ? errors.decision_number_approve : ""}
                        onChange={(e) => setFieldValue("decision_number_approve", e)}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                    <FormGroup title="Trạng thái dự án">
                      <FormSelect
                        options={STATUS_PROJECT_ARRAY}
                        label="Trạng thái dự án"
                        id="status"
                        // isDisabled
                        value={values.status && STATUS_PROJECT_ARRAY.find((item) => +item.value === +values.status)?.label}
                        error={touched.status ? errors.status : ""}
                        onChange={(e) => {
                          console.log(e);
                          setFieldValue("status", e);
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                    <FormGroup title="Ghi chú">
                      <FormCkEditor label="Mô tả" id="notes" value={values.notes ?? ""} onChange={(e) => setFieldValue("notes", e)} />
                    </FormGroup>
                  </Col>
                </Row>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    kind="submit"
                    type="third"
                    text={"Trả về"}
                    onClick={() => {
                      setIsApprove(false);
                      handleSubmit();
                    }}
                  />
                  <Button
                    kind="submit"
                    text={"Lưu"}
                    onClick={() => {
                      setIsApprove(true);
                      handleSubmit();
                    }}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
};
export default ApproveProject;
