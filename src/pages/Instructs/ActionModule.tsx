import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormSwitch from "@/components/form/FormSwitch";
import { useArchive } from "@/hooks/useArchive";
import { resetMessageError } from "@/services/store/funding_source/funding_source.slice";
import { createInstruct } from "@/services/store/instruct/instruct.thunk";
import { IIntroductionInitialState } from "@/services/store/introduction/introduction.slice";
import { EPageTypes } from "@/shared/enums/page";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, Row } from "antd";
import { Formik } from "formik";
import lodash from "lodash";
import { useEffect } from "react";
import { object, string } from "yup";

interface IInstructFormProps {
  formikRef?: FormikRefType<IInstructInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  instruct?: IInstructInitialValues;
}

export interface IInstructInitialValues {
  id?: string;
  instruct: string;
  is_use: string;
}

const InstructForm = ({ formikRef, type, instruct }: IInstructFormProps) => {
  const { dispatch } = useArchive<IIntroductionInitialState>("instruct");

  const initialValues: IInstructInitialValues = {
    id: instruct?.id ?? "", // kieu du lieu bat buoc
    instruct: instruct?.instruct ?? "",
    is_use: instruct?.is_use ?? "",
  };

  const tagSchema = object().shape({
    instruct: string().trim().required("Vui lòng không để trống trường này"),
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
          dispatch(createInstruct({ body: lodash.omit(data, "id") }));
        } else if (type === EPageTypes.UPDATE && instruct?.id) {
          dispatch(createInstruct({ body: lodash.omit(data, "id"), param: instruct.id }));
        }
      }}
    >
      {({ values, setFieldValue }) => {
        return (
          <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Bài hướng dẫn">
                  <FormCkEditor id="instruct" value={values.instruct ?? ""} onChange={(e) => setFieldValue("instruct", e)} />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
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
        );
      }}
    </Formik>
  );
};

export default InstructForm;
