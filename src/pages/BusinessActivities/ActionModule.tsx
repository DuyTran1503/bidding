import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSwitch from "@/components/form/FormSwitch";
import { useArchive } from "@/hooks/useArchive";
import { IBusinessActivityInitialState, resetMessageError } from "@/services/store/business-activity/business-activity.slice";
import { createBusinessActivity, updateBusinessActivity } from "@/services/store/business-activity/business-activity.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, Row } from "antd";
import { Form, Formik } from "formik";
import lodash from "lodash";
import { useEffect } from "react";
import { object, string } from "yup";

interface IBusinessActivityFormProps {
  formikRef?: FormikRefType<IIBusinessActivityInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  businessActivity?: IIBusinessActivityInitialValues;
}

export interface IIBusinessActivityInitialValues {
  id?: string;
  name: string;  
  description: string;
  is_active: string;
}

const BusinessActivityForm = ({ formikRef, type, businessActivity }: IBusinessActivityFormProps) => {
  const { dispatch } = useArchive<IBusinessActivityInitialState>("business");
  const initialValues: IIBusinessActivityInitialValues = {
    id: businessActivity?.id ?? "",
    name: businessActivity?.name ?? "",
    description: businessActivity?.description ?? "",
    is_active: businessActivity?.is_active ?? "",
  };
  const tagSchema = object().shape({
    name: string().trim().required("Vui lòng không để trống trường này"),
  });
  useEffect(() => {
    return () => {
      dispatch(resetMessageError());
    };
  }, []);
  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={tagSchema}
      onSubmit={(data) => {
        if (type === EPageTypes.CREATE) {
          dispatch(createBusinessActivity({ body: lodash.omit(data, "id") }));
        } else if (type === EPageTypes.UPDATE && businessActivity?.id) {
          dispatch(updateBusinessActivity({ body: lodash.omit(data, "id"), param: businessActivity.id }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => (
        <Form>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Tên loại hình doanh nghiệp">
                <FormInput
                  label="Tên loại hình doanh nghiệp"
                  placeholder="Tên loại hình doanh nghiệp..."
                  name="name"
                  value={values.name}
                  error={touched.name ? errors.name : ""}
                  onChange={(e) => setFieldValue("name", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Trạng thái hoạt động">
                <FormSwitch
                  checked={!!values.is_active ? true : false}
                  onChange={(value) => {
                    setFieldValue("is_active", value);
                  }}
                />
              </FormGroup>
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
        </Form>
      )}
    </Formik>
  );
};

export default BusinessActivityForm;
