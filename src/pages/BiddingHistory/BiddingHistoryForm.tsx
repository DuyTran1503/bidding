import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik } from "formik";
import lodash from "lodash";
import { IBiddingHistoryInitialState } from "@/services/store/biddingHistory/biddingHistory.slice";
import { IBiddingHistory } from "@/services/store/biddingHistory/biddingHistory.model";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import { createBiddingHistory, updateBiddingHistory } from "@/services/store/biddingHistory/biddingHistory.thunk";
import { EPageTypes } from "@/shared/enums/page";
import FormCkFinder from "@/components/form/FormCkFinder";

interface IBiddingHistoryFormProps {
    formikRef?: any;
    type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
    biddingHistory?: IBiddingHistory;
}

export interface IBiddingHistoryFormInitialValues {
    project_id: string;
    event_type: string;
    event_date: string;
    performed_by: string;
    event_description: string;
    is_active: string;
}

const BiddingHistoryForm = ({ formikRef, type, biddingHistory }: IBiddingHistoryFormProps) => {
    const { dispatch } = useArchive<IBiddingHistoryInitialState>("bidding_type");

    const initialValues: IBiddingHistoryFormInitialValues = {
        project_id: biddingHistory?.project_id || "",
        event_type: biddingHistory?.event_type || "",
        event_date: biddingHistory?.event_date || "",
        performed_by: biddingHistory?.performed_by || "",
        event_description: biddingHistory?.event_description || "",
        is_active: biddingHistory?.is_active ? "1" : "0",
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
                    dispatch(createBiddingHistory({ body }))
                        .unwrap()
                        .catch((error) => {
                            const apiErrors = error?.errors || {};
                            setErrors(apiErrors);
                        });
                } else if (type === EPageTypes.UPDATE) {
                    dispatch(updateBiddingHistory({ body, param: biddingHistory?.id }))
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
                                    value={values.event_type}
                                    name="event_type"
                                    error={touched.event_type ? errors.event_type : ""}
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
                                <FormCkFinder
                                    id="description"
                                    direction="vertical"
                                    value={values.event_description}
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

export default BiddingHistoryForm;
