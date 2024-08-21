import { Formik } from "formik";
import { object, string } from "yup";
import lodash from "lodash";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { FormikRefType } from "@/shared/utils/shared-types";
import { EPageTypes } from "@/shared/enums/page";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { IAttachmentInitialState, resetMessageError } from "@/services/store/attachment/attachment.slice";
import { createAttachment, updateAttachment } from "@/services/store/attachment/attachment.thunk";
import FormSelect from "@/components/form/FormSelect";

interface IAttachmentFormProps {
  formikRef?: FormikRefType<IAttachmentInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  attachment?: IAttachmentInitialValues;
}

export interface IAttachmentInitialValues {
  id?: string | number;
  user_id: string;
  project_id: string;
  name: string;
  file: string;
  is_active?: boolean;
}

const AttachmentForm = ({ formikRef, type, attachment }: IAttachmentFormProps) => {
  const { dispatch } = useArchive<IAttachmentInitialState>("attachment");
  const initialValues: IAttachmentInitialValues = {
    id: attachment?.id ?? "",
    name: attachment?.name ?? "",
    is_active: attachment?.is_active ?? false,
    user_id: attachment?.user_id ?? "",
    project_id: attachment?.project_id ?? "",
    file: attachment?.file ?? "",
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
          dispatch(createAttachment({ body: lodash.omit(data, "id") }));
        } else if (type === EPageTypes.UPDATE && attachment?.id) {
          dispatch(updateAttachment({ body: lodash.omit(data, "id"), param: String(attachment.id) }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Tên tài liệu ">
                <FormInput
                  label="Tên tài liệu "
                  placeholder="Tên loại hình tài liệu ..."
                  name="name"
                  value={values.name}
                  error={touched.name ? errors.name : ""}
                  onChange={(e) => setFieldValue("name", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Dự án">
                <FormSelect
                  label="Chọn dự án"
                  isDisabled={type === EPageTypes.VIEW}
                  placeholder="Chọn..."
                  value={undefined}
                  onChange={(value) => {
                    setFieldValue("project_id", value as string);
                  }}
                  options={[]}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Người nhập tài liệu">
                <FormInput
                  label="Người nhập tài liệu"
                  placeholder="Tên loại hình tài liệu ..."
                  name="user_id"
                  value={values.user_id}
                  error={touched.user_id ? errors.user_id : ""}
                  onChange={(e) => setFieldValue("user_id", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Dự án">
                <FormSelect
                  label="Chọn dự án"
                  isDisabled={type === EPageTypes.VIEW}
                  placeholder="Chọn..."
                  value={undefined}
                  onChange={(value) => {
                    setFieldValue("business_activity_type_id", value as string);
                  }}
                  options={[]}
                />
              </FormGroup>
            </Col>
          </Row>
        </>
      )}
    </Formik>
  );
};

export default AttachmentForm;
