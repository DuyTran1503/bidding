import Button from "@/components/common/Button";
import Dialog from "@/components/dialog/Dialog";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useViewport } from "@/hooks/useViewport";
import { ISystem } from "@/services/store/system/system.model";
import { ISystemInitialState, resetStatus } from "@/services/store/system/system.slice";
import { updateSystem } from "@/services/store/system/system.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { Col, Row } from "antd";
import { Form, Formik, FormikProps } from "formik";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { object, string } from "yup";

interface ISystemFormProps {
    type?: EButtonTypes;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    systems: ISystem
}

const SystemForm = ({ visible, type, setVisible, systems }: ISystemFormProps) => {
    const formikRef = useRef<FormikProps<ISystem>>(null);
    const { state, dispatch } = useArchive<ISystemInitialState>("system");
    const { screenSize } = useViewport();
    const initialValues: ISystem = {
        id: systems?.id || 1,
        name: systems?.name || "",
        phone: systems?.phone || "",
        email: systems?.email || "",
        address: systems?.address || "",
        logo: systems?.logo || undefined,
    };
    const Schema = object().shape({
        name: string().required("Tên là bắt buộc"),
        phone: string().required("Số điện thoại là bắt buộc"),
        email: string().required("Email là bắt buộc"),
        address: string().required("Địa chỉ là bắt buộc"),
    });
    const handleSubmit = (data: ISystem, { setErrors }: any) => {
        const newData = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            logo: data.logo,
            email: data.email,
            address: data.address,
        };
        const { logo, ...rest } = newData;
        const payload = (typeof systems?.logo === 'string' && systems.logo === logo)
            ? { ...rest, logo: (systems.logo as string).replace("https://base.septenarysolution.site/", "") }
            : newData;
        dispatch(updateSystem({ body: payload, param: String(newData?.id) }))
            .unwrap()
            .catch((error) => {
                const apiErrors = error?.errors || {};
                setErrors(apiErrors);
            });
    };
    useEffect(() => {
        if (state.status === EFetchStatus.FULFILLED) {
            setVisible(false);
        }
    }, [state.status]);

    useFetchStatus({
        module: "system",
        reset: resetStatus,
        actions: {
            success: { message: state.message },
            error: { message: state.message },
        },
    });
    return (
        <Dialog
            screenSize={screenSize}
            handleSubmit={() => {
                formikRef.current && formikRef.current.handleSubmit();
            }}
            visible={visible}
            setVisible={setVisible}
            title={"Cập nhật hệ thống"}
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
            <Formik innerRef={formikRef} initialValues={initialValues} validationSchema={Schema} enableReinitialize={true} onSubmit={handleSubmit}>
                {({ values, errors, touched, handleBlur, setFieldValue }) => (
                    <Form className="mt-3">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                                <FormGroup title="Tên công ty" required>
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.name}
                                        name="name"
                                        error={touched.name ? errors.name : ""}
                                        placeholder="Nhập tên công ty..."
                                        onChange={(value) => setFieldValue("name", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                                <FormGroup title="Email công ty" required>
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.email}
                                        name="email"
                                        error={touched.email ? errors.email : ""}
                                        placeholder="Nhập email công ty..."
                                        onChange={(value) => setFieldValue("email", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                                <FormGroup title="Số điện thoại công ty" required>
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.phone}
                                        name="phone"
                                        error={touched.phone ? errors.phone : ""}
                                        placeholder="Nhập số điện thoại công ty..."
                                        onChange={(value) => setFieldValue("phone", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                                <FormGroup title="Địa chỉ công ty" required>
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.address}
                                        name="address"
                                        error={touched.address ? errors.address : ""}
                                        placeholder="Nhập địa chỉ công ty..."
                                        onChange={(value) => setFieldValue("address", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                                <FormGroup title="Ảnh logo hệ thống" required>
                                    <FormUploadFile
                                        error={touched.logo ? errors.logo : ""}
                                        name={"logo"}
                                        value={values.logo}
                                        onChange={(e) => {
                                            setFieldValue("logo", e);
                                        }}
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

export default SystemForm;