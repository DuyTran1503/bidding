import FormCkEditor from "@/components/form/FormCkEditor";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { ISupport } from "@/services/store/support/support.model";
import { ISupportInitialState, resetStatus } from "@/services/store/support/support.slice";
import { createSupports } from "@/services/store/support/support.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { Button, Col, Row } from "antd";
import { Form, Formik } from "formik";
import lodash from "lodash";
import { AiFillCaretRight } from "react-icons/ai";

interface ISupportFormProps {
    formikRef?: any;
    type?: EButtonTypes;
    item?: ISupport;
}

const SupportForm = ({ formikRef, type, item }: ISupportFormProps) => {
    const { state, dispatch } = useArchive<ISupportInitialState>("support");

    const initialValues: ISupport = {
        id: item?.id || "",
        title: item?.title || "",
        email: item?.email || "",
        phone: item?.phone || "",
        content: item?.content || "",
        document: item?.document || undefined,
        type: item?.type || 1,
        status: item?.status || "sent",
    };

    const handleSubmit = (data: ISupport, { setErrors }: { setErrors: (errors: any) => void }) => {

        const body = {
            ...lodash.omit(data, "key", "index"),
        };
        dispatch(createSupports(body as Omit<ISupport, "id">))
            .unwrap()
            .catch((error) => {
                const apiErrors = error?.errors || {};
                setErrors(apiErrors);
            })
    };

    useFetchStatus({
        module: "support",
        reset: resetStatus,
        actions: {
          success: { message: state.message },
          error: { message: state.message },
        },
      });
    return (
        <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center text-2xl font-semibold mt-5">
                <AiFillCaretRight />Tạo mới yêu cầu
            </div>
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={handleSubmit}>
                {({ values, handleBlur, setFieldValue, touched, errors }) => (
                    <Form className="mt-3 ">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Email" required>
                                    <FormInput
                                        type="text"
                                        isDisabled={type === EButtonTypes.VIEW}
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
                                <FormGroup title="Số điện thoại" required>
                                    <FormInput
                                        type="text"
                                        isDisabled={type === EButtonTypes.VIEW}
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
                                <FormGroup title="Yêu cầu hỗ trợ" required>
                                    <FormInput
                                        type="text"
                                        isDisabled={type === EButtonTypes.VIEW}
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
                                        isDisabled={type === EButtonTypes.VIEW}
                                        defaultValue={values.type}
                                        onChange={(value) => setFieldValue("type", Number(value))}
                                        options={[
                                            { value: 1, label: "Khác" },
                                            { value: 2, label: "Kỹ thuật" },
                                            { value: 3, label: "Tư vấn đấu thầu" },
                                            { value: 4, label: "Hỗ trợ tài khoản" },
                                            { value: 5, label: "Đề xuất tính năng/Đóng góp ý tưởng" },
                                            { value: 6, label: "Báo lỗi" },
                                        ]}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={24} xl={12}>
                                <FormGroup title="Nội dung hỗ trợ">
                                    <FormCkEditor 
                                    id="description" 
                                    direction="vertical" 
                                    value={values.content} 
                                    setFieldValue={setFieldValue} 
                                    disabled={type === "view"} />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={24} xl={12}>
                                <FormGroup title="Hình ảnh hoặc file">
                                    <FormUploadFile
                                        isMultiple={false}
                                        value={values.document}
                                        onChange={(e: any) => setFieldValue("document", e)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Button type="primary" htmlType="submit" className="w-36 h-12 mx-auto flex mt-5 bg-cyan-500 font-medium text-lg">
                            Gửi yêu cầu
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SupportForm;
