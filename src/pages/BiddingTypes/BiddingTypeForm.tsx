import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik } from "formik";
import { object, string } from "yup";
import lodash from "lodash";
import { IBiddingTypeInitialState } from "@/services/store/biddingtype/biddingType.slice";
import { IBiddingType } from "@/services/store/biddingtype/biddingType.model";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import FormInputArea from "@/components/form/FormInputArea";
import { createBiddingType, updateBiddingType } from "@/services/store/biddingtype/biddingType.thunk";

interface IBiddingTypeFormProps {
    formikRef?: any;
    type: "create" | "view" | "update";
    biddingType?: IBiddingType;
}

export interface IBiddingTypeFormInitialValues {
    name: string;
    description: string;
    is_active: string;
}

const BiddingTypeForm = ({ formikRef, type, biddingType }: IBiddingTypeFormProps) => {
    const { dispatch } = useArchive<IBiddingTypeInitialState>("biddingtype");

    const initialValues: IBiddingTypeFormInitialValues = {
        name: biddingType?.name || "",
        description: biddingType?.description || "",
        is_active: biddingType?.is_active ? "1" : "0",
    };

    const validationSchema = object().shape({
        name: string().required("Vui lòng nhập tên loại đấu thầu"),
        description: string().required("Vui lòng nhập mô tả loại đấu thầu"),
    });

    return (
        <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={(data) => {
                const body = {
                    ...lodash.omit(data, "id"),
                };
                if (type === "create") {
                    dispatch(createBiddingType({ body }));
                } else if (type === "update") {
                    dispatch(updateBiddingType({ body, param: biddingType?.id }));
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
                                    placeholder="Nhập tên loại đấu thầu..."
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
                                <FormInputArea
                                    label="Mô tả"
                                    placeholder="Nhập mô tả..."
                                    name="description"
                                    value={values.description}
                                    error={touched.description ? errors.description : ""}
                                    onChange={(e) => setFieldValue("description", e)}
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
