import Button from "@/components/common/Button";
import Dialog from "@/components/dialog/Dialog";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSwitch from "@/components/form/FormSwitch";
import FormTreeSelect from "@/components/form/FormTreeSelect";
import { useArchive } from "@/hooks/useArchive";
import { useViewport } from "@/hooks/useViewport";
import { IEvaluationCriteria } from "@/services/store/evaluation/evaluation.model";
import { IEvaluationCriteriaInitialState } from "@/services/store/evaluation/evaluation.slice";
import { createEvaluation, updateEvaluation } from "@/services/store/evaluation/evaluation.thunk";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPageTypes } from "@/shared/enums/page";
import { Col, Row } from "antd";
import { Form, Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { number, object, string } from "yup";

interface IEvaluationCriteriaFormProps {
  type?: EPageTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IEvaluationCriteria;
  listProjects?: any[];
}

const formatTreeData = (data: any[]): { title: string; value: string; key: string; children?: any[] }[] => {
  return data.map((item) => ({
    title: item.name,
    value: item.id.toString(),
    key: item.id.toString(),
    children: item.children ? formatTreeData(item.children) : [],
  }));
};

const ActionModuleEvaluationCriteria = ({ visible, type, setVisible, item, listProjects = [], }: IEvaluationCriteriaFormProps) => {
  const formikRef = useRef<FormikProps<IEvaluationCriteria>>(null);
  const { state, dispatch } = useArchive<IEvaluationCriteriaInitialState>("evaluation");
  const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
  useEffect(() => {
    const formattedData = formatTreeData(listProjects);
    setTreeData(formattedData);
  }, [listProjects]);

  const { screenSize } = useViewport();
  const initialValues: IEvaluationCriteria = {
    id: item?.id || "",
    project_id: item?.project_id || item?.project?.id || undefined,
    is_active: item?.is_active ? "0" : "1",
    name: item?.name || "",
    weight: item?.weight || "",
    project: item?.project || undefined,
    description: item?.description || "",
  };

  const stringRegex = /^[\p{L}0-9\s._,`-]*$/u;
  const Schema = object().shape({
    project_id: string().trim().required("Vui lòng chọn dự án"),
    description: string().trim().required("Vui lòng nhập mô tả"),
    name: string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng nhập tên tiêu chí đánh giá"),
    weight: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng nhập trọng số đánh giá"),
  });

  const handleSubmit = (data: IEvaluationCriteria, { setErrors }: any) => {
    const body = {
      ...lodash.omit(data, "key", "index", "id"),
    };
    if (type === EPageTypes.CREATE) {
      return dispatch(createEvaluation({ body: body }))
        .unwrap()
        .catch((error) => {
          const apiErrors = error?.errors || {};
          setErrors(apiErrors);
        });
    }
    if (type === EPageTypes.UPDATE && item?.id) {
      return dispatch(updateEvaluation({ body: body, param: item?.id }));
    }
  };
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
      title={
        type === EPageTypes.CREATE
          ? "Tạo mới tiêu chi đánh giá"
          : type === EPageTypes.UPDATE
            ? "Cập nhật tiêu chi đánh giá"
            : "Chi tiết tiêu chi đánh giá"
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
      <Formik innerRef={formikRef} initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit} validationSchema={Schema}>
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form className="mt-3">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Tên dự án" required>
                  <FormTreeSelect
                    isDisabled={type === "view"}
                    value={values?.project_id as any}
                    placeholder="Nhập tên dự án..."
                    error={touched.project_id ? errors.project_id : ""}
                    onChange={(value) => {
                      setFieldValue("project_id", value as string);
                    }}
                    treeData={treeData}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Tên tiêu chí đánh giá" required>
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.name}
                    name="name"
                    error={touched.name ? errors.name : ""}
                    placeholder="Nhập tên tiêu chí đánh giá..."
                    onChange={(value) => setFieldValue("name", value)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Trọng số đánh giá" required>
                  <FormInput
                    type="number"
                    isDisabled={type === "view"}
                    value={values.weight}
                    name="weight"
                    error={touched.weight ? errors.weight : ""}
                    placeholder="Nhập trọng số đánh giá..."
                    onChange={(value) => setFieldValue("weight", value)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSwitch
                  label="Trạng thái"
                  checked={values.is_active === "0"}
                  onChange={(value) => {
                    setFieldValue("is_active", value ? "0" : "1");
                  }}
                />
              </Col>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Mô Tả" required>
                  <FormCkEditor
                    id="description"
                    error={touched.description ? errors.description : ""}
                    direction="vertical"
                    value={values.description}
                    setFieldValue={setFieldValue}
                    disabled={type === EPageTypes.VIEW}
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

export default ActionModuleEvaluationCriteria;
