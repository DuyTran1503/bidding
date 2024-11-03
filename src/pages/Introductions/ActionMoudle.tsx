import FormGroup from "@/components/form/FormGroup";
import FormInputArea from "@/components/form/FormInputArea";
import { useArchive } from "@/hooks/useArchive";
import { resetMessageError } from "@/services/store/funding_source/funding_source.slice";
import { IIntroductionInitialState } from "@/services/store/introduction/introduction.slice";
import { createIntroduction, updateIntroduction } from "@/services/store/introduction/introduction.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, Row } from "antd";
import { Formik } from "formik";
import lodash from "lodash";
import { useEffect } from "react";
import { object, string } from "yup";

interface IIntroductionFormProps {
  formikRef?: FormikRefType<IIntroductionInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  introduction?: IIntroductionInitialValues;
}

export interface IIntroductionInitialValues {
  id?: string;
  introduction: string;
  is_use: string;
}

const IntroductionForm = ({ formikRef, type, introduction }: IIntroductionFormProps) => {
  const { dispatch } = useArchive<IIntroductionInitialState>("introduction");

  const initialValues: IIntroductionInitialValues = {
    id: introduction?.id ?? "", // kieu du lieu bat buoc
    introduction: introduction?.introduction ?? "",
    is_use: introduction?.is_use ?? "",
  };

  const tagSchema = object().shape({
    introduction: string().trim().required("Vui lòng không để trống trường này"),
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
          dispatch(createIntroduction({ body: lodash.omit(data, "id") }));
        } else if (type === EPageTypes.UPDATE && introduction?.id) {
          dispatch(updateIntroduction({ body: lodash.omit(data, "id"), param: introduction.id }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
          <>
            {/* <Row gutter={[24, 24]}>
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
                <FormGroup title="Loại nguồn tài trợ">
                  <FormSelect
                    label="Loại nguồn tài trợ"
                    placeholder="Chọn loại nguồn tài trợ..."
                    isDisabled={type === EPageTypes.VIEW}
                    id="type"
                    options={convertEnum(TypeFundingSource)}
                    value={values.type || undefined}
                    error={touched.type ? errors.type : ""}
                    onChange={(e) => setFieldValue("type", e)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Mã nguồn tài trợ">
                  <FormInput
                    label="Mã nguồn tài trợ"
                    placeholder="Mã nguồn tài trợ..."
                    name="code"
                    value={values.code}
                    error={touched.code ? errors.code : ""}
                    onChange={(e) => setFieldValue("code", e)}
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
            </Row> */}
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Giới thiệu">
                  <FormInputArea
                    label="Giới thiệu"
                    placeholder="Nhập bài giới thiệu..."
                    name="introduction"
                    isReadonly={type === EPageTypes.VIEW}
                    value={values.introduction}
                    error={touched.introduction ? errors.introduction : ""}
                    onChange={(e) => setFieldValue("introduction", e)}
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

export default IntroductionForm;
