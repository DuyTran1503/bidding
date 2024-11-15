import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Col, Form, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import FormCkEditor from "@/components/form/FormCkEditor";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { useViewport } from "@/hooks/useViewport";
import { IPostCatalog } from "@/services/store/postCatalog/postCatalog.model";
import { createPostCatalog, updatePostCatalog } from "@/services/store/postCatalog/postCatalog.thunk";
import { IPostCatalogInitialState } from "@/services/store/postCatalog/postCatalog.slice";

interface IPostCatalogFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IPostCatalog;
}

const PostCatalogForm = ({ visible, type, setVisible, item }: IPostCatalogFormProps) => {
  const formikRef = useRef<FormikProps<IPostCatalog>>(null);
  const { state, dispatch } = useArchive<IPostCatalogInitialState>("post_catalog");
  const { screenSize } = useViewport();
  const initialValues: IPostCatalog = {
    id: item?.id || "",
    name: item?.name || "",
    description: item?.description || "",
    is_active: item?.is_active ? "1" : "0",
  };
  const handleSubmit = (data: IPostCatalog, { setErrors }: any) => {
    const body = {
      ...lodash.omit(data, "id", "key", "index"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(createPostCatalog({ body }))
        .unwrap()
        .catch((error) => {
          const apiErrors = error?.errors || {};
          setErrors(apiErrors);
        });;
    } else if (type === EButtonTypes.UPDATE) {
      dispatch(updatePostCatalog({ body, param: item?.id }));
    }
  };
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      setVisible(false);
    }
  }, [state.status]);

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
          ? "Tạo mới danh mục bài viết"
          : type === EButtonTypes.UPDATE
            ? "Cập nhật danh mục bài viết"
            : "Chi tiết danh mục bài viết"
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
      <Formik innerRef={formikRef} initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form className="mt-3">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24}>
                <FormGroup title="Tên danh mục bài viết">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.name}
                    name="name"
                    error={touched.name ? errors.name : ""}
                    placeholder="Nhập tên danh mục bài viết..."
                    onChange={(value) => setFieldValue("name", value)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={24} xl={24}>
                <FormGroup title="Trạng thái">
                  <FormSwitch
                    checked={values.is_active === "1"}
                    onChange={(value) => {
                      setFieldValue("is_active", value ? "1" : "0");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={24} xl={24}>
                <FormGroup title="Mô tả">
                  <FormCkEditor
                    id="description"
                    direction="vertical"
                    value={values.description}
                    setFieldValue={setFieldValue}
                    disabled={type === EButtonTypes.VIEW}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default PostCatalogForm;
