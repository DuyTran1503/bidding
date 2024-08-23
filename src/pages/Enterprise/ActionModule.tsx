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
import { IEnterpriseInitialState, resetMessageError } from "@/services/store/enterprise/enterprise.slice";
import { createEnterprise, updateEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import FormSelect from "@/components/form/FormSelect";
import { mappingTypeEnterprise, typeEnterpriseEnumArray } from "@/shared/enums/typeEnterprise";
import { IOption } from "@/shared/utils/shared-interfaces";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormDate from "@/components/form/FormDate";
import dayjs from "dayjs";
import { IBusinessActivityInitialState } from "@/services/store/business-activity/business-activity.slice";
import { getListBusinessActivity } from "@/services/store/business-activity/business-activity.thunk";
import FormUploadImage from "@/components/form/FormUploadImage";

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
  avatar?: string;
  taxcode?: string;
  account_ban_at?: string | null;
  website?: string;
  industries?: number[];
  industry_id?: number[];
  description?: string;
  establish_date?: string;
  organization_type?: string | number;
  avg_document_rating?: string;
  registration_date?: string;
  registration_number?: string;
  is_active?: boolean;
  is_blacklist?: boolean;
  password?: string;
}
const EnterpriseForm = ({ formikRef, type, enterprise }: IEnterpriseFormProps) => {
  const { dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: industryState, dispatch: dispatchIndustry } = useArchive<IBusinessActivityInitialState>("business");
  const initialValues: IEnterpriseInitialValues = {
    id: enterprise?.id ?? "",
    name: enterprise?.name ?? "",
    address: enterprise?.address ?? "",
    description: enterprise?.description ?? "",
    representative: enterprise?.representative ?? "",
    phone: enterprise?.phone ?? "",
    email: enterprise?.email ?? "",
    avatar: enterprise?.avatar ?? "",
    taxcode: enterprise?.taxcode ?? "",
    account_ban_at: enterprise?.account_ban_at ?? null,
    website: enterprise?.website ?? "",
    industries: enterprise?.industries ?? [],
    industry_id: enterprise?.industry_id ?? [],
    establish_date: enterprise?.establish_date ?? "",
    organization_type: enterprise?.organization_type ?? "",
    // avg_document_rating: enterprise?.avg_document_rating ?? "",
    registration_date: enterprise?.registration_date ?? "",
    registration_number: enterprise?.registration_number ?? "",
    password: enterprise?.password ?? "",
    is_active: enterprise?.is_active ?? false,
    is_blacklist: enterprise?.is_blacklist ?? false,
  };
  const tagSchema = object().shape({
    name: string().trim().required("Vui lòng không để trống trường này"),
  });
  useEffect(() => {
    return () => {
      dispatchEnterprise(resetMessageError());
    };
  }, []);
  useEffect(() => {
    dispatchIndustry(getListBusinessActivity());
  }, []);
  const typeOptions: IOption[] = typeEnterpriseEnumArray.map((e) => ({
    value: e,
    label: mappingTypeEnterprise[e],
  }));
  const optionsIndustry: IOption[] = industryState.listBusinessActivities.map((e) => ({
    value: e.id,
    label: e.name,
  }));
  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={tagSchema}
      onSubmit={(data) => {
        const body = {
          ...lodash.omit(data, "id", "industries", "avg_document_rating "),
          account_ban_at: data.account_ban_at ? dayjs(new Date().toISOString()).format("YYYY-MM-DD") : null,
        };

        if (type === EPageTypes.CREATE) {
          dispatchEnterprise(createEnterprise({ body: body }));
        } else if (type === EPageTypes.UPDATE && enterprise?.id) {
          dispatchEnterprise(updateEnterprise({ body: lodash.omit(data, "id", "industries", "avg_document_rating"), param: String(enterprise.id) }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
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
                <FormGroup title="Người đại diện">
                  <FormInput
                    label="Người đại diện"
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
                <FormGroup title="Lĩnh vực kinh doanh">
                  <FormSelect
                    options={optionsIndustry}
                    label="Lĩnh vực kinh doanh"
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn..."
                    isMultiple
                    value={values.industry_id}
                    id="industry_id"
                    onChange={(value) => {
                      setFieldValue("industry_id", value);
                    }}
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
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    label="Ngày gia nhập"
                    value={values.establish_date ? dayjs(values.establish_date) : null}
                    onChange={(date) => setFieldValue("establish_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Ngày đăng ký kinh doanh">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    label="Ngày đăng ký kinh doanh"
                    value={values.registration_date ? dayjs(values.registration_date) : null}
                    onChange={(date) => setFieldValue("registration_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
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
                    name="taxcode"
                    value={values.taxcode}
                    error={touched.taxcode ? errors.taxcode : ""}
                    onChange={(e) => setFieldValue("taxcode", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Loại hình tổ chức">
                  <FormSelect
                    label="Chọn loại hình tổ chức"
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn..."
                    value={typeOptions?.find((e) => e.value === values.organization_type)?.label}
                    id="organization_type"
                    onChange={(value) => {
                      setFieldValue("organization_type", value);
                    }}
                    options={typeOptions}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={type === EPageTypes.CREATE ? 12 : 24} xl={type === EPageTypes.CREATE ? 12 : 24} className="mb-4">
                <FormGroup title="Số đăng ký kinh doanh">
                  <FormInput
                    label="Số đăng ký kinh doanh"
                    placeholder="Nhập số đăng ký kinh doanh..."
                    name="registration_number"
                    value={values.registration_number}
                    error={touched.registration_number ? errors.registration_number : ""}
                    onChange={(e) => setFieldValue("registration_number", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              {type === EPageTypes.CREATE && (
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Mật khẩu">
                    <FormInput
                      type="password"
                      label="Mật khẩu"
                      value={values.password ?? ""}
                      name="password"
                      error={touched.password ? errors.password : ""}
                      placeholder="Nhập mật khẩu..."
                      onChange={(value) => {
                        setFieldValue("password", value);
                      }}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
              )}
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Website">
                  <FormInput
                    label="Website"
                    placeholder="Nhập website"
                    name="website"
                    value={values.website}
                    error={touched.website ? errors.website : ""}
                    onChange={(e) => setFieldValue("website", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Mô tả">
                  <FormCkEditor label="Mô tả" id="description" value={values.description ?? ""} onChange={(e) => setFieldValue("description", e)} />
                </FormGroup>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Ảnh doanh nghiệp">
                  <FormUploadImage
                    onChange={(e: any) => {
                      console.log(e?.at(0)?.name);
                      setFieldValue("avatar", e?.at(0)?.name);
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Trạng thái cấm">
                  <FormSwitch
                    checked={!!values.account_ban_at ? true : false}
                    onChange={(value) => {
                      setFieldValue("account_ban_at", value);
                    }}
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
                <FormGroup title="Danh sách blacklist">
                  <FormSwitch
                    checked={!!values.is_blacklist ? true : false}
                    onChange={(value) => {
                      setFieldValue("is_blacklist", value);
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

export default EnterpriseForm;
