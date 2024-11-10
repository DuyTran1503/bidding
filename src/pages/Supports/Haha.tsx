import { useArchive } from "@/hooks/useArchive";
import FormInput from "@/components/form/FormInput";
import { Form, Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Col, Row } from "antd";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { useViewport } from "@/hooks/useViewport";
import { ISupport } from "@/services/store/support/support.model";
import { ISupportInitialState } from "@/services/store/support/support.slice";
import { createSupport } from "@/services/store/support/support.thunk";
import FormSelect from "@/components/form/FormSelect";
import FormGroup from "@/components/form/FormGroup";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";

interface ISupportFormProps {
    type?: EButtonTypes;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    item?: ISupport;
}

const SupportForm = ({ visible, type, setVisible, item }: ISupportFormProps) => {
    const formikRef = useRef<FormikProps<ISupport>>(null);
    const { dispatch } = useArchive<ISupportInitialState>("support");
    const { screenSize } = useViewport();
    const initialValues: ISupport = {
        id: item?.id || "",
        title: item?.title || "",
        email: item?.email || "",
        phone: item?.phone || "",
        content: item?.content || "",
        document: item?.document || undefined,
        type: item?.type || 0,
        status: item?.status || "sent",
    };

    const handleSubmit = (data: ISupport, { setErrors }: { setErrors: (errors: any) => void }) => {
        const body = {
            ...lodash.omit(data, "key", "index"),
        };
        if (type === EButtonTypes.CREATE) {
            dispatch(createSupport(body as Omit<ISupport, "id">))
                .unwrap()
                .catch((error) => {
                    const apiErrors = error?.errors || {};
                    setErrors(apiErrors); // Sử dụng setErrors để gán lỗi từ API vào form
                });
        }
    };    

    return (
        <Dialog
            screenSize={screenSize}
            handleSubmit={() => {
                formikRef.current && formikRef.current.handleSubmit();
            }}
            visible={visible}
            setVisible={setVisible}
            title={type === EButtonTypes.CREATE ? "Tạo mới công tác" : type === EButtonTypes.UPDATE ? "Cập nhật công tác" : "Chi tiết công tác"}
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
                {({ values, handleBlur, setFieldValue, touched, errors }) => (
                    <Form className="mt-3">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Yêu cầu hỗ trợ hỗ trợ" required>
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.title}
                                        name="title"
                                        error={touched.title ? errors.title : ""}
                                        placeholder="Nhập loại hỗ trợ..."
                                        onChange={(value) => setFieldValue("title", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>

                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Loại hỗ trợ" required>
                                    <FormSelect
                                        placeholder="Chọn loại hỗ trợ"
                                        isDisabled={type === "view"}
                                        defaultValue={values.type}
                                        onChange={(value) => setFieldValue("type", Number(value))}
                                        options={[
                                            { value: 1, label: "Khác" },
                                            { value: 2, label: "Kỹ thuật" },
                                            { value: 3, label: "Tư vấn đấu thầu" },
                                            { value: 4, label: "Hỗ trợ tài khoản" },
                                            { value: 5, label: "Báo lỗi" },
                                        ]}
                                    />
                                </FormGroup>
                            </Col>

                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Email" required>
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.email}
                                        name="email"
                                        error={touched.email ? errors.email : ""}
                                        placeholder="Nhập email..."
                                        onChange={(value) => setFieldValue("email", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>

                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Số điện thoại">
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.phone}
                                        name="phone"
                                        error={touched.phone ? errors.phone : ""}
                                        placeholder="Nhập số điện thoại..."
                                        onChange={(value) => setFieldValue("phone", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>

                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Nội dung hỗ trợ">
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.content}
                                        name="content"
                                        error={touched.content ? errors.content : ""}
                                        placeholder="Nhập nội dung hỗ trợ..."
                                        onChange={(value) => setFieldValue("content", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>

                            <Col xs={24} sm={24} md={24} xl={24}>
                                <FormGroup title="Hình ảnh">
                                    <FormUploadFile
                                        isMultiple={false}
                                        value={values.document}
                                        onChange={(e: any) => setFieldValue("document", e)}
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

export default SupportForm;
