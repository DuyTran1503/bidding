import { Formik, Form } from "formik";
import { object, string } from "yup";
import lodash from "lodash";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { FormikRefType } from "@/shared/utils/shared-types";
import { EPageTypes } from "@/shared/enums/page";
import FormSwitch from "@/components/form/FormSwitch";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { IIndustryInitialState, resetMessageError } from "@/services/store/industry/industry.slice";
import FormSelect from "@/components/form/FormSelect";
import { createIndustry, updateIndustry } from "@/services/store/industry/industry.thunk";
import { IBusinessActivityInitialState } from "@/services/store/business-activity/business-activity.slice";
import { convertDataOption, selectedData } from "@/shared/utils/common/function";
import { getListBusinessActivity } from "@/services/store/business-activity/business-activity.thunk";
import FormCkEditor from "@/components/form/FormCkEditor";

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
  const { state: businessState, dispatch: dispatchBusiness } = useArchive<IBusinessActivityInitialState>("business");

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
  useEffect(() => {
    dispatchBusiness(getListBusinessActivity());
  }, [dispatchBusiness]);
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
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
          <Form>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Tên nghành kinh doanh">
                  <FormInput
                    label="Tên nghành kinh doanh"
                    placeholder="Tên nghành kinh doanh..."
                    name="name"
                    value={values.name}
                    isDisabled={type === EPageTypes.VIEW}
                    error={touched.name ? errors.name : ""}
                    onChange={(e) => setFieldValue("name", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Ngành nghề kinh doanh">
                  <FormSelect
                    label="Ngành nghề kinh doanh"
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn..."
                    options={convertDataOption(businessState?.listBusinessActivities!)}
                    value={
                      type === EPageTypes.UPDATE || EPageTypes.VIEW
                        ? selectedData(businessState?.listBusinessActivities, values.business_activity_type_id)?.name
                        : undefined
                    }
                    onChange={(value) => {
                      setFieldValue("business_activity_type_id", value as string);
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                {/* <FormGroup title="Mô tả">
                  <FormInputArea
                    label="Mô tả"
                    placeholder="Nhập mô tả..."
                    name="description"
                    isReadonly={type === EPageTypes.VIEW}
                    value={values.description}
                    error={touched.description ? errors.description : ""}
                    onChange={(e) => setFieldValue("description", e)}
                  />
                </FormGroup> */}
                <FormCkEditor
                  id="description"
                  direction="vertical"
                  value={values.description}
                  setFieldValue={setFieldValue}
                  disabled={type === EPageTypes.VIEW}
                />
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Trạng thái hoạt động">
                  <FormSwitch
                    checked={!!values.is_active ? true : false}
                    isDisabled={type === EPageTypes.VIEW}
                    onChange={(value) => {
                      setFieldValue("is_active", value);
                    }}
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

export default IndustryForm;
