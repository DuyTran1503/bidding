import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormInputArea from "@/components/form/FormInputArea";
import FormSwitch from "@/components/form/FormSwitch";
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
      {({ values, setFieldValue }) => {
        return (
          <>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Giới thiệu">
                  <FormCkEditor id="introduction" value={values.introduction ?? ""} onChange={(e) => setFieldValue("introduction", e)} />
                </FormGroup>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} className="mb-4">
                <FormGroup title="Trạng thái hoạt động">
                  <FormSwitch
                    checked={!!values.is_use ? true : false}
                    onChange={(value) => {
                      setFieldValue("is_use", value);
                    }}
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
