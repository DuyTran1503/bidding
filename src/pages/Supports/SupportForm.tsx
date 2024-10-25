import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Form, Formik } from "formik";
import lodash from "lodash";
import { ISupportInitialState } from "@/services/store/support/support.slice";
import { Col, Row } from "antd";
import { createSupport } from "@/services/store/support/support.thunk";
import { FormikRefType } from "@/shared/utils/shared-types";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { useEffect, useState } from "react";
import { EPageTypes } from "@/shared/enums/page";
import FormSelect from "@/components/form/FormSelect";

interface ISupportFormProps {
    formikRef?: FormikRefType<ISupportFormInitialValues>;
    type: EPageTypes;
    support?: ISupportFormInitialValues;
}

export interface ISupportFormInitialValues {
    id: string;
    title: string;
    email: string;
    phone: string;
    content: string;
    document?: File | string;
    type: number;
    status: string;
}

const SupportForm = ({ formikRef, type, support }: ISupportFormProps) => {
    const [loading, setLoading] = useState(false);
    const { dispatch, state } = useArchive<ISupportInitialState>("support");

    const initialValues: ISupportFormInitialValues = {
        id: support?.id || "",
        title: support?.title || "",
        email: support?.email || "",
        phone: support?.phone || "",
        content: support?.content || "",
        document: support?.document || undefined,
        type: support?.type || 0,
        status: support?.status || "sent",
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
                    dispatch(createSupport(body as Omit<ISupportFormInitialValues, "id">))
                        .unwrap()
                        .catch((error) => {
                            const apiErrors = error?.errors || {};
                            setErrors(apiErrors);
                        });
                }
            }}
        >
            {({ values, errors, touched, handleBlur, setFieldValue }) => {
                useEffect(() => {
                    if (!loading) {
                        setLoading(true);
                    }
                }, [loading, state.filter, setFieldValue, dispatch]);

                return (
                    <Form className="flex flex-col gap-6">
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
                                        defaultValue={values.type || "Chọn loại hỗ trợ"}
                                        options={[
                                            { value: "1", label: "Khác" },
                                            { value: "2", label: "Kỹ thuật" },
                                            { value: "3", label: "Tự vấn đấu thầu" },
                                            { value: "4", label: "Hỗ trợ tài khoản" },
                                            { value: "5", label: "Báo lỗi" },
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
                );
            }}
        </Formik>
    );
};

export default SupportForm;
