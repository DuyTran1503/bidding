import { Formik, FormikProps } from "formik";
import { object, string } from "yup";
import lodash from "lodash";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { FormikRefType } from "@/shared/utils/shared-types";
import { EPageTypes } from "@/shared/enums/page";
import { Col, Row } from "antd";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { IAttachmentInitialState, resetMessageError } from "@/services/store/attachment/attachment.slice";
import { createAttachment, updateAttachment } from "@/services/store/attachment/attachment.thunk";
import FormSelect from "@/components/form/FormSelect";
import Dialog from "@/components/dialog/Dialog";
import { EButtonTypes } from "@/shared/enums/button";
import { IAttachment } from "@/services/store/attachment/attachment.model";
import { useViewport } from "@/hooks/useViewport";
import Button from "@/components/common/Button";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";

interface IAttachmentFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>; // Add setVisible prop
  item?: IAttachment;
  OnSaveSuccess?: (id: number) => void;
}

export interface IAttachmentInitialValues {
  id?: string | number;
  user_id: string;
  project_id: string;
  name: string;
  path: string | File;
  is_active?: boolean;
}

const AttachmentForm = ({ visible, type, setVisible, item, OnSaveSuccess }: IAttachmentFormProps) => {
  const { dispatch } = useArchive<IAttachmentInitialState>("attachment");
  const formikRef = useRef<FormikProps<IAttachmentInitialValues>>(null);
  const { screenSize } = useViewport();
  const initialValues: IAttachmentInitialValues = {
    id: item?.id ?? "",
    name: item?.name ?? "",
    is_active: item?.is_active ?? false,
    user_id: item?.user_id ?? "",
    project_id: item?.project_id ?? "",
    path: item?.path ?? "",
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
    <Dialog
      screenSize={screenSize}
      handleSubmit={() => {
        formikRef.current && formikRef.current.handleSubmit();
      }}
      visible={visible}
      setVisible={setVisible}
      title={
        type === EButtonTypes.CREATE
          ? "Tạo mới hình thức đấu thầu"
          : type === EButtonTypes.UPDATE
            ? "Cập nhật Tạo mới hình thức đấu thầu"
            : "Chi tiết Tạo mới hình thức đấu thầu"
      }
      footerContent={
        <div className="flex items-center justify-center gap-2">
          <Button key="cancel" text={"Hủy"} type="secondary" onClick={() => setVisible(false)} />
          {type !== EButtonTypes.VIEW && (
            <Button
              key="submit"
              kind="submit"
              text={"Lưu"}
              onClick={() => {
                formikRef.current && formikRef.current.handleSubmit();
              }}
            />
          )}
        </div>
      }
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={tagSchema}
        onSubmit={(data) => {
          if (type === EButtonTypes.CREATE) {
            dispatch(createAttachment({ body: lodash.omit(data, "id") }));
            OnSaveSuccess && OnSaveSuccess(data?.id as number);
          } else if (type === EButtonTypes.UPDATE && item?.id) {
            dispatch(updateAttachment({ body: lodash.omit(data, "id"), param: String(item.id) }));
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
                    isDisabled={type === EButtonTypes.VIEW}
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
                <FormGroup title="Tài liệu đính kèm">
                  <FormUploadFile value={values.path} onChange={(e) => setFieldValue("file", e)}></FormUploadFile>
                </FormGroup>
              </Col>
            </Row>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

export default AttachmentForm;
