import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { IFundingSourceInitialState, resetMessageError } from "@/services/store/funding_source/funding_source.slice";
import { createFundingSource, updateFundingSource } from "@/services/store/funding_source/funding_source.thunk";
import { FormikRefType } from "@/shared/utils/shared-types";
import FormSwitch from "@/components/form/FormSwitch"
import FormInputArea from "@/components/form/FormInputArea";
import { Formik } from "formik";
import { object, string } from "yup";
import lodash from "lodash";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { EPageTypes } from "@/shared/enums/page";
import { Form } from "react-router-dom";

interface IFundingSourceFormProps {
    formikRef?: FormikRefType<IFundingSourceFormInitialValues>;
    type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW
    fundingSource? : IFundingSourceFormInitialValues
}

export interface IFundingSourceFormInitialValues {
    id?: string ;
    name: string;
    type: string;
    code: string;
    description: string;
    is_active: string;
}

const FundingSourceForm = ({ formikRef, type, fundingSource }: IFundingSourceFormProps ) => {
    const { dispatch } = useArchive<IFundingSourceInitialState>("funding_source");

    const initialValues: IFundingSourceFormInitialValues = {
        id: fundingSource?.id ?? "", // kieu du lieu bat buoc
        name: fundingSource?.name ?? "",
        type: fundingSource?.type ?? "",
        code: fundingSource?.code ?? "",
        description: fundingSource?.description ?? "",
        is_active: fundingSource?.is_active ?? "",
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
            dispatch(createFundingSource({ body: lodash.omit(data, "id") }));
          } else if (type === EPageTypes.UPDATE && fundingSource?.id) {
            dispatch(updateFundingSource({ body: lodash.omit(data, "id"), param: fundingSource.id }));
          }
        }}
      >
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
                    <Form>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                        <FormGroup title="Tên nguồn tài trợ">
                          <FormInput
                            label="Tên nguồn tài trợ"
                            placeholder="Tên nguồn tài trợ..."
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
                  </Form>
        )}
      </Formik>
    );
};

export default FundingSourceForm;