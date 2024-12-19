import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { IFundingSourceInitialState, resetMessageError } from "@/services/store/funding_source/funding_source.slice";
import { createFundingSource, updateFundingSource } from "@/services/store/funding_source/funding_source.thunk";
import { FormikRefType } from "@/shared/utils/shared-types";
import FormSwitch from "@/components/form/FormSwitch";
import FormInputArea from "@/components/form/FormInputArea";
import { Formik } from "formik";
import lodash from "lodash";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { EPageTypes } from "@/shared/enums/page";
import FormSelect from "@/components/form/FormSelect";
import { TypeFundingSource } from "@/shared/enums/type_funding_source";
import { convertEnum } from "@/shared/utils/common/convertEnum";
import { schemaFundingSource } from "@/shared/Schema/schema";

interface IFundingSourceFormProps {
  formikRef?: FormikRefType<IFundingSourceInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  fundingSource?: IFundingSourceInitialValues;
}

export interface IFundingSourceInitialValues {
  id?: string;
  name: string;
  type: string;
  code: string;
  description: string;
  is_active: string;
}

const FundingSourceForm = ({ formikRef, type, fundingSource }: IFundingSourceFormProps) => {
  const { dispatch } = useArchive<IFundingSourceInitialState>("funding_source");

  const initialValues: IFundingSourceInitialValues = {
    id: fundingSource?.id ?? "", // kieu du lieu bat buoc
    name: fundingSource?.name ?? "",
    type: fundingSource?.type ?? "",
    code: fundingSource?.code ?? "",
    description: fundingSource?.description ?? "",
    is_active: fundingSource?.is_active ?? "",
  };

  useEffect(() => {
    return () => {
      dispatch(resetMessageError());
    };
  }, []);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={schemaFundingSource}
      onSubmit={(data, { setErrors }: any) => {
        if (type === EPageTypes.CREATE) {
          dispatch(createFundingSource({ body: lodash.omit(data, "id") }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        } else if (type === EPageTypes.UPDATE && fundingSource?.id) {
          dispatch(updateFundingSource({ body: lodash.omit(data, "id"), param: fundingSource.id }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Tên nguồn tài trợ" required={true}>
                  <FormInput
                    placeholder="Tên nguồn tài trợ..."
                    isDisabled={type === EPageTypes.VIEW}
                    name="name"
                    value={values.name}
                    error={touched.name || !values.name ? errors.name : ""}
                    onChange={(e) => setFieldValue("name", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Loại nguồn tài trợ" required>
                  <FormSelect
                    placeholder="Chọn loại nguồn tài trợ..."
                    isDisabled={type === EPageTypes.VIEW}
                    id="type"
                    options={convertEnum(TypeFundingSource)}
                    value={values.type || undefined}
                    error={touched.type || !values.type ? errors.type : ""}
                    onChange={(e) => setFieldValue("type", e)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Mã nguồn tài trợ" required>
                  <FormInput
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Mã nguồn tài trợ..."
                    name="code"
                    value={values.code}
                    error={touched.code || !values.code ? errors.code : ""}
                    onChange={(e) => setFieldValue("code", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Trạng thái hoạt động">
                  <FormSwitch
                    isDisabled={type === EPageTypes.VIEW}
                    checked={!!values.is_active ? true : false}
                    onChange={(value) => {
                      setFieldValue("is_active", value);
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24} xl={24}>
                <FormGroup title="Mô tả" required>
                  <FormInputArea
                    placeholder="Nhập mô tả..."
                    name="description"
                    isReadonly={type === EPageTypes.VIEW}
                    value={values.description}
                    error={touched.description ? errors.description : ""}
                    onChange={(e) => setFieldValue("description", e)}
                  />
                </FormGroup>
              </Col>
            </Row>
          </>
        );
      }}
    </Formik>
  );
};

export default FundingSourceForm;
