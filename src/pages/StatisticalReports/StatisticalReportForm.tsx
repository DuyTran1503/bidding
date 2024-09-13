import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik } from "formik";
import lodash from "lodash";
import { IStatisticalReportInitialState } from "@/services/store/statisticalReport/statisticalReport.slice";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import { createStatisticalReport, updateStatisticalReport } from "@/services/store/statisticalReport/statisticalReport.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { IStatisticalReport } from "@/services/store/statisticalReport/statisticalReport.model";
import FormCkEditor from "@/components/form/FormCkEditor";

interface IStatisticalReportFormProps {
  formikRef?: any;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  statisticalReport?: IStatisticalReport;
}

export interface IStatisticalReportFormInitialValues {
  user_id: string;
  name: string;
  type: string;
  period: string;
  description: string;
  is_active: string;
}

const StatisticalReportForm = ({ formikRef, type, statisticalReport }: IStatisticalReportFormProps) => {
  const { dispatch } = useArchive<IStatisticalReportInitialState>("statistical_report");

  const initialValues: IStatisticalReportFormInitialValues = {
    user_id: statisticalReport?.user_id || "",
    name: statisticalReport?.name || "",
    type: statisticalReport?.type || "",
    period: statisticalReport?.period || "",
    description: statisticalReport?.description || "",
    is_active: statisticalReport?.is_active ? "1" : "0",
  };
  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(data, { setErrors }) => {
        const body = {
          ...lodash.omit(data, "id"),
        };
        if (type === EPageTypes.CREATE) {
          dispatch(createStatisticalReport({ body }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        } else if (type === EPageTypes.UPDATE) {
          dispatch(updateStatisticalReport({ body, param: statisticalReport?.id }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => (
        <div>
          <FormGroup title="Thêm mới">
            <FormInput
              type="text"
              isDisabled={type === "view"}
              label="Tên báo cáo thống kê"
              value={values.name}
              name="name"
              error={touched.name ? errors.name : ""}
              placeholder="Nhập tên loại hình đấu thầu..."
              onChange={(value) => setFieldValue("name", value)}
              onBlur={handleBlur}
            />
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === EPageTypes.VIEW || type === EPageTypes.UPDATE || type === EPageTypes.CREATE}
                  label="Tên người tạo báo cáo"
                  value={values.user_id}
                  name="user_id"
                  error={touched.user_id ? errors.user_id : ""}
                  placeholder="Nhập tên người tạo"
                  onChange={(value) => setFieldValue("user_id", value)}
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
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === EPageTypes.VIEW}
                  label="Loại báo cáo"
                  value={values.type}
                  name="type"
                  error={touched.type ? errors.type : ""}
                  placeholder="Nhập loại báo cáo..."
                  onChange={(value) => setFieldValue("type", value)}
                  onBlur={handleBlur}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === EPageTypes.VIEW}
                  label="Kỳ báo cáo"
                  value={values.period}
                  name="period"
                  error={touched.period ? errors.period : ""}
                  placeholder="Nhập Kỳ báo cáo..."
                  onChange={(value) => setFieldValue("period", value)}
                  onBlur={handleBlur}
                />
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Mô tả">
                  <FormCkEditor
                    id="description"
                    direction="vertical"
                    value={values.description}
                    setFieldValue={setFieldValue}
                    disabled={type === EPageTypes.VIEW}
                  />
                </FormGroup>
              </Col>
            </Row>
          </FormGroup>
        </div>
      )}
    </Formik>
  );
};

export default StatisticalReportForm;
