import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik } from "formik";
import lodash from "lodash";
import { ISelectionMethodInitialState } from "@/services/store/selectionMethod/selectionMethod.slice";
import { ISelectionMethod } from "@/services/store/selectionMethod/selectionMethod.model";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import { createSelectionMethod, updateSelectionMethod } from "@/services/store/selectionMethod/selectionMethod.thunk";
import { EPageTypes } from "@/shared/enums/page";
import FormCkEditor from "@/components/form/FormCkEditor";

interface ISelectionMethodFormProps {
    formikRef?: any;
    type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
    selectionMethod?: ISelectionMethod;
}

export interface ISelectionMethodFormInitialValues {
    method_name: string;
    description: string;
    is_active: string;
}

const SelectionMethodForm = ({ formikRef, type, selectionMethod }: ISelectionMethodFormProps) => {
    const { dispatch } = useArchive<ISelectionMethodInitialState>("selection_method");

    const initialValues: ISelectionMethodFormInitialValues = {
        method_name: selectionMethod?.method_name || "",
        description: selectionMethod?.description || "",
        is_active: selectionMethod?.is_active ? "1" : "0",
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
                    dispatch(createSelectionMethod({ body }))
                        .unwrap()
                        .catch((error) => {
                            const apiErrors = error?.errors || {};
                            setErrors(apiErrors);
                        });
                } else if (type === EPageTypes.UPDATE) {
                    dispatch(updateSelectionMethod({ body, param: selectionMethod?.id }))
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
                                    label="Tên hình thức đấu thầu"
                                    value={values.method_name}
                                    name="method_name"
                                    error={touched.method_name ? errors.method_name : ""}
                                    placeholder="Nhập tên hình thức đấu thầu..."
                                    onChange={(value) => setFieldValue("method_name", value)}
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
                                <FormGroup title="Mô tả">
                                    <FormCkEditor
                                        id="description"
                                        direction="vertical"
                                        value={values.description}
                                        setFieldValue={setFieldValue}
                                        disabled={type === EPageTypes.VIEW}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </FormGroup>
                </div>
            )}
        </Formik>
    );
};

export default SelectionMethodForm;
