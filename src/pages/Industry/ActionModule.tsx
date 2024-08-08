import { Formik, Form } from "formik";
import { object, string } from "yup";
import lodash from "lodash";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { FormikRefType } from "@/shared/utils/shared-types";
import { EPageTypes } from "@/shared/enums/page";
import FormSwitch from "@/components/form/FormSwitch";
import FormInputArea from "@/components/form/FormInputArea";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { IIndustryInitialState, resetMessageError } from "@/services/store/industry/industry.slice";
import FormTreeSelect from "@/components/form/FormTreeSelect";
import FormSelect from "@/components/form/FormSelect";
import { createIndustry, updateIndustry } from "@/services/store/industry/industry.thunk";
import { useSelector } from "react-redux";
import { RootStateType } from "@/services/reducers";
import { IBusinessActivityInitialState } from "@/services/store/business-activity/business-activity.slice";
import { convertDataOption } from "@/shared/utils/common/function";

interface IIndustryFormProps {
  formikRef?: FormikRefType<IndustryInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  industry?: IndustryInitialValues;
}

export interface IndustryInitialValues {
  id?: string;
  name: string;
  business_activity_type_id: string;
  description: string;
  is_active: string;
}

const IndustryForm = ({ formikRef, type, industry }: IIndustryFormProps) => {
  const { dispatch } = useArchive<IIndustryInitialState>("industry");
  const { state: businessState } = useArchive<IBusinessActivityInitialState>("business");

  const initialValues: IndustryInitialValues = {
    id: industry?.id ?? "",
    name: industry?.name ?? "",
    description: industry?.description ?? "",
    is_active: industry?.is_active ?? "",
    business_activity_type_id: industry?.business_activity_type_id ?? "",
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
          dispatch(createIndustry({ body: lodash.omit(data, "id") }));
        } else if (type === EPageTypes.UPDATE && industry?.id) {
          dispatch(updateIndustry({ body: lodash.omit(data, "id"), param: industry.id }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => (
        <Form>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Tên nghành kinh doanh">
                <FormInput
                  label="Tên nghành kinh doanh"
                  placeholder="Tên nghành kinh doanh..."
                  name="name"
                  value={values.name}
                  error={touched.name ? errors.name : ""}
                  onChange={(e) => setFieldValue("name", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Loại hình kinh doanh">
                <FormSelect
                  label="Loại hình kinh doanh"
                  isDisabled={type === EPageTypes.VIEW}
                  placeholder="Chọn..."
                  options={convertDataOption(businessState.businessActivities)}
                  defaultValue={values.business_activity_type_id}
                  onChange={(value) => {
                    setFieldValue("business_activity_type_id", value as string);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
              <FormGroup title="Mô tả">
                <FormInputArea
                  label="Mô tả"
                  placeholder="Nhập mô tả..."
                  name="description"
                  value={values.description}
                  error={touched.description ? errors.description : ""}
                  onChange={(e) => setFieldValue("description", e)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
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
        </Form>
      )}
    </Formik>
  );
};

export default IndustryForm;
