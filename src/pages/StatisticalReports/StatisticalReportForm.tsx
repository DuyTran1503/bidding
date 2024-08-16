import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik } from "formik";
import lodash from "lodash";
import { IStatisticalReportInitialState } from "@/services/store/statisticalReport/statisticalReport.slice";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import FormInputArea from "@/components/form/FormInputArea";
import { createStatisticalReport, updateStatisticalReport } from "@/services/store/statisticalReport/statisticalReport.thunk";
import { IStatisticalReport } from "@/services/store/statisticalReport/statisticalReport.motel";
import { EPageTypes } from "@/shared/enums/page";

interface IStatisticalReportFormProps {
  formikRef?: any;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  statisticalReport?: IStatisticalReport;
}

export interface IStatisticalReportFormInitialValues {
  name: string;
  description: string;
  is_active: string;
}

const StatisticalReportForm = ({ formikRef, type, statisticalReport }: IStatisticalReportFormProps) => {
  const { dispatch } = useArchive<IStatisticalReportInitialState>("statistical_report");

  const initialValues: IStatisticalReportFormInitialValues = {
    name: statisticalReport?.name || "",
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
          <FormGroup title="Thông tin chung">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
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
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormInputArea
                  label="Mô tả"
                  placeholder="Nhập mô tả..."
                  name="description"
                  value={values.description}
                  error={touched.description ? errors.description : ""}
                  onChange={(e) => setFieldValue("description", e)}
                />
              </Col>
            </Row>
          </FormGroup>
        </div>
      )}
    </Formik>
  );
};

export default StatisticalReportForm;
