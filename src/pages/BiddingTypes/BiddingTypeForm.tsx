import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik } from "formik";
import lodash from "lodash";
import { IBiddingTypeInitialState } from "@/services/store/biddingType/biddingType.slice";
import { IBiddingType } from "@/services/store/biddingType/biddingType.model";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import { createBiddingType, updateBiddingType } from "@/services/store/biddingType/biddingType.thunk";
import { EPageTypes } from "@/shared/enums/page";
import FormCkEditor from "@/components/form/FormCkEditor";

interface IBiddingTypeFormProps {
  formikRef?: any;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  biddingType?: IBiddingType;
}

export interface IBiddingTypeFormInitialValues {
  name: string;
  description: string;
  is_active: string;
}

const BiddingTypeForm = ({ formikRef, type, biddingType }: IBiddingTypeFormProps) => {
  const { dispatch } = useArchive<IBiddingTypeInitialState>("bidding_type");

  const initialValues: IBiddingTypeFormInitialValues = {
    name: biddingType?.name || "",
    description: biddingType?.description || "",
    is_active: biddingType?.is_active ? "1" : "0",
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(data, { setErrors }) => {
        const body = {
          ...lodash.omit(data, "id"),
        };
        if (type === EPageTypes.CREATE) {
          dispatch(createBiddingType({ body }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        } else if (type === EPageTypes.UPDATE) {
          dispatch(updateBiddingType({ body, param: biddingType?.id }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => (
        <div>
          <FormGroup title="Thông tin chung">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Tên loại đấu thầu"
                  value={values.name}
                  name="name"
                  error={touched.name ? errors.name : ""}
                  placeholder="Nhập tên loại hình đấu thầu..."
                  onChange={(value) => setFieldValue("name", value)}
                  onBlur={handleBlur}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSwitch
                  label="Trạng thái"
                  checked={values.is_active === "1"}
                  onChange={(value) => {
                    setFieldValue("is_active", value ? "1" : "0");
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormCkEditor
                  id="description"
                  direction="vertical"
                  value={values.description}
                  setFieldValue={setFieldValue}
                  disabled={type === EPageTypes.VIEW}
                />
              </Col>
            </Row>
          </FormGroup>
        </div>
      )}
    </Formik>
  );
};

export default BiddingTypeForm;
