import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Form, Formik, FormikProps } from "formik";
import lodash from "lodash";
import { IBannerInitialState } from "@/services/store/banner/banner.slice";
import { IBanner } from "@/services/store/banner/banner.model";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import { createBanner, updateBanner } from "@/services/store/banner/banner.thunk";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { useViewport } from "@/hooks/useViewport";

interface IBannerFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IBanner;
}

export interface IBannerValues {
  id: string;
  name: string;
  path?: File;
  is_active: string;
}

const BannerForm = ({ visible, type, setVisible, item }: IBannerFormProps) => {
  const formikRef = useRef<FormikProps<IBanner>>(null);
  const { state, dispatch } = useArchive<IBannerInitialState>("banner");
  const { screenSize } = useViewport();
  const initialValues: IBanner = {
    id: item?.id || "",
    name: item?.name || "",
    path: item?.path ?? undefined,
    is_active: item?.is_active ? "1" : "0",
  };
  const handleSubmit = (data: IBanner) => {
    const body = {
      ...lodash.omit(data, "key", "index"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(createBanner(body as Omit<IBanner, "id">));
    } else if (type === EButtonTypes.UPDATE && item?.id) {
      const newData = item.path === body.path ? (({ ...rest }) => rest)(body) : body;
      dispatch(updateBanner({ body: newData, param: item?.id }));
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
      title={type === EButtonTypes.CREATE ? "Tạo mới banner" : type === EButtonTypes.UPDATE ? "Cập nhật Tạo mới banner" : "Chi tiết Tạo mới banner"}
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
        {({ values, handleBlur, setFieldValue }) => (
          <Form className="mt-3">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Tên Banner"
                  value={values.name}
                  name="name"
                  placeholder="Nhập tên Banner..."
                  onChange={(value) => setFieldValue("name", value)}
                  onBlur={handleBlur}
                />
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Hình ảnh">
                  <FormUploadFile
                    isMultiple={false}
                    value={values.path}
                    onChange={(e: any) => {
                      setFieldValue("path", e);
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormSwitch
                  label="Trạng thái"
                  checked={values.is_active === "1"}
                  onChange={(value) => {
                    setFieldValue("is_active", value ? "1" : "0");
                  }}
                />
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default BannerForm;