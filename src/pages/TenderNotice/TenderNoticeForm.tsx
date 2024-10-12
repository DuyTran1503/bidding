import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik } from "formik";
import lodash from "lodash";
import { ITenderNoticeInitialState } from "@/services/store/tenderNotice/tenderNotice.slice";
import { ITenderNotice } from "@/services/store/tenderNotice/tenderNotice.model";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import { createTenderNotice, updateTenderNotice } from "@/services/store/tenderNotice/tenderNotice.thunk";
import { EPageTypes } from "@/shared/enums/page";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormDate from "@/components/form/FormDate";
import dayjs from "dayjs";

interface ITenderNoticeFormProps {
    formikRef?: any;
    type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
    tenderNotice?: ITenderNotice;
}

export interface ITenderNoticeFormInitialValues {
    project_id: string;
    enterprise_id: string;
    notice_content: string;
    notice_date: string;
    expiry_date: string;
    is_active: string;
}

const TenderNoticeForm = ({ formikRef, type, tenderNotice }: ITenderNoticeFormProps) => {
    const { dispatch } = useArchive<ITenderNoticeInitialState>("tender_notice");

    const initialValues: ITenderNoticeFormInitialValues = {
        project_id: tenderNotice?.project_id || "",
        enterprise_id: tenderNotice?.enterprise_id || "",
        notice_content: tenderNotice?.notice_content || "",
        notice_date: tenderNotice?.notice_date || "",
        expiry_date: tenderNotice?.expiry_date || "",
        is_active: tenderNotice?.is_active ? "1" : "0",
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
                    dispatch(createTenderNotice({ body }))
                        .unwrap()
                        .catch((error) => {
                            const apiErrors = error?.errors || {};
                            setErrors(apiErrors);
                        });
                } else if (type === EPageTypes.UPDATE) {
                    dispatch(updateTenderNotice({ body, param: tenderNotice?.id }))
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
                                    label="Nội dung thông báo mời thầu"
                                    value={values.notice_content}
                                    name="notice_content"
                                    error={touched.notice_content ? errors.notice_content : ""}
                                    placeholder="Nhập nội dung thông báo mời thầu..."
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
                            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                                <FormDate
                                    disabled={type === EPageTypes.VIEW}
                                    label="Ngày thông báo"
                                    value={values.notice_date ? dayjs(values.notice_date) : null}
                                    onChange={(date) => setFieldValue("notice_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                                <FormDate
                                    disabled={type === EPageTypes.VIEW}
                                    label="Ngày hết hạn"
                                    value={values.expiry_date ? dayjs(values.expiry_date) : null}
                                    onChange={(date) => setFieldValue("expiry_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                                />
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                                <FormCkEditor
                                    id="expiry_date"
                                    direction="vertical"
                                    value={values.expiry_date}
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

export default TenderNoticeForm;
