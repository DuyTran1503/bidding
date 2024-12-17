import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormSwitch from "@/components/form/FormSwitch";
import { useArchive } from "@/hooks/useArchive";
import { IBusinessActivityInitialState } from "@/services/store/business-activity/business-activity.slice";
import { getListBusinessActivity } from "@/services/store/business-activity/business-activity.thunk";
import { IIndustry } from "@/services/store/industry/industry.model";
import { IIndustryInitialState, resetMessageError } from "@/services/store/industry/industry.slice";
import { createIndustry, updateIndustry } from "@/services/store/industry/industry.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { convertDataOption, selectedData } from "@/shared/utils/common/function";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, Row } from "antd";
import { Form, Formik } from "formik";
import lodash from "lodash";
import { useEffect } from "react";
import { object, string } from "yup";

interface IIndustryFormProps {
  formikRef?: FormikRefType<IIndustry>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  industry?: IIndustry;
}

const IndustryForm = ({ formikRef, type, industry }: IIndustryFormProps) => {
  const { dispatch } = useArchive<IIndustryInitialState>("industry");
  const { state: businessState, dispatch: dispatchBusiness } = useArchive<IBusinessActivityInitialState>("business");

  const initialValues: IIndustry = {
    id: industry?.id ?? "",
    name: industry?.name ?? "",
    description: industry?.description ?? "",
    is_active: industry?.is_active ?? "",
    business_activity_type_id: industry?.business_activity_type_id || industry?.business_activity_type?.id as any || undefined,
  };
  const tagSchema = object().shape({
    name: string().trim().required("Vui lòng nhập tên ngành kinh doanh"),
    business_activity_type_id: string().trim().required("Vui lòng chọn loại hình kinh doanh")
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
                <FormGroup title="Ngành kinh doanh" required>
                  <FormInput
                    placeholder="Nhập ngành kinh doanh..."
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
                <FormGroup title="Loại hình kinh doanh">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn..."
                    error={touched.business_activity_type_id ? errors.business_activity_type_id : ""}
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
