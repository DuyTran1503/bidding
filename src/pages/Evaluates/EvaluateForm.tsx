import Button from "@/components/common/Button";
import Dialog from "@/components/dialog/Dialog";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { useArchive } from "@/hooks/useArchive";
import { useViewport } from "@/hooks/useViewport";
import { IEvaluate } from "@/services/store/evaluate/evaluate.model";
import { IEvaluateInitialState } from "@/services/store/evaluate/evaluate.slice";
import { createEvaluate, updateEvaluate } from "@/services/store/evaluate/evaluate.thunk";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPageTypes } from "@/shared/enums/page";
import { Col, Form, Row } from "antd";
import { Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { convertDataOptions } from "../Project/helper";
import FormTreeSelect from "@/components/form/FormTreeSelect";

interface IEvaluateFormProps {
  type?: EPageTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IEvaluate;
  listEnterprise?: any[]; // Thay đổi kiểu nếu cần
  listProjects?: any[]; // Thay đổi kiểu nếu cần
}

const EvaluateForm = ({ visible, type, setVisible, item, listEnterprise = [], listProjects = [] }: IEvaluateFormProps) => {
  const formikRef = useRef<FormikProps<IEvaluate>>(null);
  const { state, dispatch } = useArchive<IEvaluateInitialState>("evaluate");
  const { screenSize } = useViewport();
  const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);

  const initialValues: IEvaluate = {
    id: item?.id || "",
    project_id: item?.project_id || item?.project?.id || undefined,
    enterprise_id: item?.enterprise_id || (item?.enterprise?.id as any) || undefined,
    title: item?.title || "",
    score: item?.score || 10,
    evaluate: item?.evaluate || "",
    project: item?.project || undefined,
    enterprise: item?.enterprise || undefined,
  };
  const Schema = object().shape({
    project_id: string().required("Dự án là bắt buộc"),
    enterprise_id: string().required("Doanh nghiệp là bắt buộc"),
    score: string()
      .required("Số điểm là bắt buộc")
      .test("min-max", "Số điểm phải từ 1 đến 10", (value) => {
        const num = Number(value);
        return num >= 1 && num <= 10;
      }),
    title: string().required("Tiêu đề là bắt buộc"),
    evaluate: string().required("Nội dung là bắt buộc"),
  });

  const handleSubmit = (data: IEvaluate, { setErrors }: any) => {
    const body = {
      ...lodash.omit(data, "id", "key", "index"),
    };
    if (type === EPageTypes.CREATE) {
      dispatch(createEvaluate({ body }))
        .unwrap()
        .catch((error) => {
          const apiErrors = error?.errors || {};
          setErrors(apiErrors);
        });
    } else if (type === EPageTypes.UPDATE) {
      dispatch(updateEvaluate({ body, param: item?.id }))
        .unwrap()
        .catch((error) => {
          const apiErrors = error?.errors || {};
          setErrors(apiErrors);
        });
    }
  };

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      setTreeData(listProjects);
      setVisible(false);
    }
  }, [state.status]);
  useEffect(() => {
    setTreeData(listProjects);
  }, [visible]);
  console.log(treeData);

  return (
    <Dialog
      screenSize={screenSize}
      handleSubmit={() => {
        formikRef.current && formikRef.current.handleSubmit();
      }}
      visible={visible}
      setVisible={setVisible}
      title={
        type === EPageTypes.CREATE
          ? "Tạo mới đánh giá kết quả dự án"
          : type === EPageTypes.UPDATE
            ? "Cập nhật đánh giá kết quả dự án"
            : "Chi tiết đánh giá kết quả dự án"
      }
      footerContent={
        <div className="flex items-center justify-center gap-2">
          <Button key="cancel" text={"Hủy"} type="secondary" onClick={() => setVisible(false)} />
          {type !== EPageTypes.VIEW && (
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
      <Formik innerRef={formikRef} initialValues={initialValues} validationSchema={Schema} enableReinitialize={true} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form className="mt-3">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Dự án" required>
                  <FormSelect
                    isDisabled={type === "view" || type === "update"}
                    value={values.project_id}
                    id="project_id"
                    placeholder="Nhập tên dự án..."
                    error={touched.project_id ? errors.project_id : ""}
                    onChange={(value) => setFieldValue("project_id", value)}
                    options={convertDataOptions(listProjects)}
                  />
                  <FormTreeSelect
                    label="Chọn dự án"
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn lĩnh vực cha"
                    treeData={treeData}
                    value={String(values.project_id)}
                    defaultValue={(values.project_id as unknown as string) || undefined}
                    onChange={(value) => {
                      setFieldValue("parent_id", value as string);
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Doanh nghiệp" required>
                  <FormSelect
                    isDisabled={type === "view" || type === "update"}
                    placeholder="Nhập doanh nghiệp"
                    id="enterprise_id"
                    value={values.enterprise_id || values.enterprise?.user?.name}
                    error={touched.enterprise_id ? errors.enterprise_id : ""}
                    onChange={(e) => setFieldValue("enterprise_id", e)}
                    options={convertDataOptions(listEnterprise)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Tiêu đề" required>
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.title}
                    name="title"
                    error={touched.title ? errors.title : ""}
                    placeholder="Nhập tiêu đề..."
                    onChange={(value) => setFieldValue("title", value)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Điểm" required>
                  <FormInput
                    type="number"
                    isDisabled={type === "view"}
                    value={values.score}
                    name="score"
                    error={touched.score ? errors.score : ""}
                    placeholder="Nhập điểm..."
                    onChange={(value) => setFieldValue("score", value)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={24} xl={24}>
                <FormGroup title="Nội dung" required>
                  <FormCkEditor
                    id="evaluate"
                    direction="vertical"
                    value={values.evaluate}
                    setFieldValue={setFieldValue}
                    disabled={type === EPageTypes.VIEW}
                    error={touched.evaluate ? errors.evaluate : ""}
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

export default EvaluateForm;
