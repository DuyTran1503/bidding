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
import { IEnterpriseInitialState, resetMessageError } from "@/services/store/enterprise/enterprise.slice";
import { createEnterprise, updateEnterprise } from "@/services/store/enterprise/enterprise.thunk";

interface IEnterpriseFormProps {
  formikRef?: FormikRefType<IEnterpriseInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  enterprise?: IEnterpriseInitialValues;
}

export interface IEnterpriseInitialValues {
  id?: string | number;
  name: string;
  address: string;
  representative: string;
  phone: string;
  email: string;
  website?: string;
  join_date: string;
  id_business_activity: string[];
  description: string;
  tax_code: string;
  organization_type: string;
  representative_name: string;
  business_registration_date: string;
  business_registration_number: string;
  is_active?: boolean;
  is_blacklisted?: boolean;
}

const EnterpriseForm = ({ formikRef, type, enterprise }: IEnterpriseFormProps) => {
  const { dispatch } = useArchive<IEnterpriseInitialState>("enterprise");
  const initialValues: IEnterpriseInitialValues = {
    id: enterprise?.id ?? "",
    name: enterprise?.name ?? "",
    address: enterprise?.address ?? "",
    description: enterprise?.description ?? "",
    representative: enterprise?.representative ?? "",
    phone: enterprise?.phone ?? "",
    email: enterprise?.email ?? "",
    join_date: enterprise?.join_date ?? "",
    id_business_activity: enterprise?.id_business_activity ?? [],
    tax_code: enterprise?.tax_code ?? "",
    organization_type: enterprise?.organization_type ?? "",
    representative_name: enterprise?.representative_name ?? "",
    business_registration_date: enterprise?.business_registration_date ?? "",
    business_registration_number: enterprise?.business_registration_number ?? "",
    is_active: enterprise?.is_active ?? false,
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
          dispatch(createEnterprise({ body: lodash.omit(data, "id") }));
        } else if (type === EPageTypes.UPDATE && enterprise?.id) {
          dispatch(updateEnterprise({ body: lodash.omit(data, "id"), param: String(enterprise.id) }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => (
        <Form>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Tên doanh nghiệp">
                <FormInput
                  label="Tên doanh nghiệp"
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
              <FormGroup title="Đại diện">
                <FormInput
                  label="Đại diện"
                  placeholder="Nhập đại diện..."
                  name="representative"
                  value={values.representative}
                  error={touched.representative ? errors.representative : ""}
                  onChange={(e) => setFieldValue("representative", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Địa chỉ">
                <FormInput
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ..."
                  name="address"
                  value={values.address}
                  error={touched.address ? errors.address : ""}
                  onChange={(e) => setFieldValue("address", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Tên đại diện">
                <FormInput
                  label="Tên đại diện"
                  placeholder="Nhập tên đại diện..."
                  name="representative_name"
                  value={values.representative_name}
                  error={touched.representative_name ? errors.representative_name : ""}
                  onChange={(e) => setFieldValue("representative_name", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Số điện thoại liên hệ">
                <FormInput
                  label="Số điện thoại liên hệ"
                  placeholder="Nhập số điện thoại liên hệ..."
                  name="phone"
                  value={values.phone}
                  error={touched.phone ? errors.phone : ""}
                  onChange={(e) => setFieldValue("phone", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Email">
                <FormInput
                  label="Email"
                  placeholder="Nhập email..."
                  name="email"
                  value={values.email}
                  error={touched.email ? errors.email : ""}
                  onChange={(e) => setFieldValue("email", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Ngày gia nhập">
                <FormInput
                  label="Ngày gia nhập"
                  placeholder="Nhập ngày gia nhập..."
                  name="join_date"
                  value={values.join_date}
                  error={touched.join_date ? errors.join_date : ""}
                  onChange={(e) => setFieldValue("join_date", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Lĩnh vực kinh doanh">
                <FormInput
                  label="Lĩnh vực kinh doanh"
                  placeholder="Nhập lĩnh vực kinh doanh..."
                  name="id_business_activity"
                  value={""}
                  error={""}
                  onChange={(e) => setFieldValue("id_business_activity", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Mã số thuế">
                <FormInput
                  label="Mã số thuế"
                  placeholder="Nhập mã số thuế..."
                  name="tax_code"
                  value={values.tax_code}
                  error={touched.tax_code ? errors.tax_code : ""}
                  onChange={(e) => setFieldValue("tax_code", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Loại hình tổ chức">
                <FormInput
                  label="Loại hình tổ chức"
                  placeholder="Nhập loại hình tổ chức..."
                  name="organization_type"
                  value={values.organization_type}
                  error={touched.organization_type ? errors.organization_type : ""}
                  onChange={(e) => setFieldValue("organization_type", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Ngày đăng ký kinh doanh">
                <FormInput
                  label="Ngày đăng ký kinh doanh"
                  placeholder="Nhập ngày đăng ký kinh doanh..."
                  name="business_registration_date"
                  value={values.business_registration_date}
                  error={touched.business_registration_date ? errors.business_registration_date : ""}
                  onChange={(e) => setFieldValue("business_registration_date", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Số đăng ký kinh doanh">
                <FormInput
                  label="Số đăng ký kinh doanh"
                  placeholder="Nhập số đăng ký kinh doanh..."
                  name="business_registration_number"
                  value={values.business_registration_number}
                  error={touched.business_registration_number ? errors.business_registration_number : ""}
                  onChange={(e) => setFieldValue("business_registration_number", e)}
                  onBlur={handleBlur}
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
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Trạng thái đen">
                <FormSwitch
                  checked={!!values.is_blacklisted ? true : false}
                  onChange={(value) => {
                    setFieldValue("is_blacklisted", value);
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

export default EnterpriseForm;
