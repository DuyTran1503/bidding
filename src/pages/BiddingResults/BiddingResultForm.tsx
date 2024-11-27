import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik } from "formik";
import lodash from "lodash";
import { IBiddingResultInitialState } from "@/services/store/biddingResult/biddingResult.slice";
import { IBiddingResult } from "@/services/store/biddingResult/biddingResult.model";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import { createBiddingResult, updateBiddingResult } from "@/services/store/biddingResult/biddingResult.thunk";
import { EPageTypes } from "@/shared/enums/page";
import FormCkEditor from "@/components/form/FormCkEditor";
import { IProject } from "@/services/store/project/project.model";
import { IEnterprise } from "@/services/store/enterprise/enterprise.model";

interface IBiddingResultFormProps {
    formikRef?: any;
    type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
    biddingResult?: IBiddingResult;
}

export interface IBiddingResultFormInitialValues {
    project: IProject;
    enterprise: IEnterprise;
    decision_number: string;
    decision_date: string;
    is_active: string;
}

const BiddingResultForm = ({ formikRef, type, biddingResult }: IBiddingResultFormProps) => {
    const { dispatch } = useArchive<IBiddingResultInitialState>("bidding_result");

    const initialValues: IBiddingResultFormInitialValues = {
        project: biddingResult?.project as IProject,
        enterprise: biddingResult?.enterprise as IEnterprise,
        decision_number: biddingResult?.decision_number || "",
        decision_date: biddingResult?.decision_date || "",
        is_active: biddingResult?.is_active ? "1" : "0",
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
                    dispatch(createBiddingResult({ body }))
                        .unwrap()
                        .catch((error) => {
                            const apiErrors = error?.errors || {};
                            setErrors(apiErrors);
                        });
                } else if (type === EPageTypes.UPDATE) {
                    dispatch(updateBiddingResult({ body, param: biddingResult?.id }))
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
                                    label="Tên loại sự kiện đấu thầu"
                                    value={values.project?.name}
                                    name="project?.name"
                                    error={touched.project?.name ? errors.project?.name : ""}
                                    placeholder="Nhập loại sự kiện đấu thầu..."
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
                            <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                                <FormCkEditor
                                    id="decision_date"
                                    direction="vertical"
                                    value={values.decision_date}
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

export default BiddingResultForm;
