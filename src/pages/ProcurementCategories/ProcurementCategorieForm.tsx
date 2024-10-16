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
import { object, string } from "yup";
import { useViewport } from "@/hooks/useViewport";
import { IProcurementCategorie } from "@/services/store/procurementCategorie/procurementCategorie.model";
import { createProcurementCategorie, updateProcurementCategorie } from "@/services/store/procurementCategorie/procurementCategorie.thunk";
import { IProcurementCategorieInitialState } from "@/services/store/procurementCategorie/procurementCategorie.slice";

interface IProcurementCategorieFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>; // Add setVisible prop
  item?: IProcurementCategorie;
}

const ProcurementCategorieForm = ({ visible, type, setVisible, item }: IProcurementCategorieFormProps) => {
  const formikRef = useRef<FormikProps<IProcurementCategorie>>(null);
  const { state, dispatch } = useArchive<IProcurementCategorieInitialState>("procurement_categorie");
  const { screenSize } = useViewport();
  const initialValues: IProcurementCategorie = {
    id: item?.id || "",
    name: item?.name || "",
    description: item?.description || "",
    is_active: item?.is_active ? "1" : "0",
  };
  const schema = object().shape({
    name: string()
      .trim()
      .matches(/^[\p{L}0-9\s._`-]*$/u, "Không chứa ký tự đặc biệt không hợp lệ")
      .max(255, "Số ký tự tối đa là 255 ký tự"),
  });
  const handleSubmit = (data: IProcurementCategorie) => {
    const body = {
      ...lodash.omit(data, "id", "key", "index"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(createProcurementCategorie({ body }));
    } else if (type === EButtonTypes.UPDATE) {
      dispatch(updateProcurementCategorie({ body, param: item?.id }));
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
          ? "Tạo mới loại hình MSC"
          : type === EButtonTypes.UPDATE
            ? "Cập nhật Tạo mới loại hình MSC"
            : "Chi tiết Tạo mới loại hình MSC"
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
      <Formik innerRef={formikRef} validationSchema={schema} initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form className="mt-3">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Tên loại hình MSC"
                  value={values.name}
                  name="name"
                  error={touched.name ? errors.name : ""}
                  placeholder="Nhập tên loại hình MSC..."
                  onChange={(value) => setFieldValue("name", value)}
                  onBlur={handleBlur}
                />
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
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

export default ProcurementCategorieForm;