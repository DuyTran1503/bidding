import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Col, Form, Row } from "antd";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { useViewport } from "@/hooks/useViewport";
import { IEvaluate } from "@/services/store/evaluate/evaluate.model";
import { createEvaluate, updateEvaluate } from "@/services/store/evaluate/evaluate.thunk";
import { IEvaluateInitialState } from "@/services/store/evaluate/evaluate.slice";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { getListProject } from "@/services/store/project/project.thunk";
import FormSelect from "@/components/form/FormSelect";
import { convertDataOptions } from "../Project/helper";

interface IEvaluateFormProps {
    type?: EButtonTypes;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    item?: IEvaluate;
}

const EvaluateForm = ({ visible, type, setVisible, item }: IEvaluateFormProps) => {
    const formikRef = useRef<FormikProps<IEvaluate>>(null);
    const { dispatch } = useArchive<IEvaluateInitialState>("evaluate");
    const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
    const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
    const { screenSize } = useViewport();
    const initialValues: IEvaluate = {
        id: item?.id || "",
        project_id: item?.project_id || [],
        enterprise_id: item?.enterprise_id || [],
        title: item?.title || "",
        score: item?.score || 0,
        evaluate: item?.evaluate || "",
    };
    const handleSubmit = (data: IEvaluate, { setErrors }: any) => {
        const body = {
            ...lodash.omit(data, "id", "key", "index"),
        };
        if (type === EButtonTypes.CREATE) {
            dispatch(createEvaluate({ body }))
                .unwrap()
                .catch((error) => {
                    const apiErrors = error?.errors || {};
                    setErrors(apiErrors);
                });;
        } else if (type === EButtonTypes.UPDATE) {
            dispatch(updateEvaluate({ body, param: item?.id }));
        }
    };

    useEffect(() => {
        dispatchEnterprise(getListEnterprise());
        dispatchProject(getListProject());
    }, []);

    return (
        <Dialog
            screenSize={screenSize}
            handleSubmit={() => {
                formikRef.current && formikRef.current.handleSubmit();
            }}
            visible={visible}
            setVisible={setVisible}
            title={
                type === EButtonTypes.CREATE
                    ? "Tạo mới danh mục bài viết"
                    : type === EButtonTypes.UPDATE
                        ? "Cập nhật danh mục bài viết"
                        : "Chi tiết danh mục bài viết"
            }
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
                {({ values, errors, touched, handleBlur, setFieldValue }) => (
                    <Form className="mt-3">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                                <FormGroup title="Doanh nghiệp">
                                    <FormSelect
                                        placeholder="Nhập doanh nghiệp"
                                        id="enterprise_id"
                                        value={values.enterprise_id}
                                        error={touched.enterprise_id ? errors.enterprise_id : ""}
                                        onChange={(e) => setFieldValue("enterprise_id", e)}
                                        options={convertDataOptions(stateEnterprise.listEnterprise || [])}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                                <FormGroup title="Dự án">
                                    <FormSelect
                                        placeholder="Nhập dự án"
                                        id="project_id"
                                        value={values.project_id}
                                        error={touched.project_id ? errors.project_id : ""}
                                        onChange={(e) => setFieldValue("project_id", e)}
                                        options={convertDataOptions(stateProject.listProjects || [])}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Tiêu đề">
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.evaluate}
                                        name="evaluate"
                                        error={touched.evaluate ? errors.evaluate : ""}
                                        placeholder="Nhập tiêu đề..."
                                        onChange={(value) => setFieldValue("evaluate", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Điểm">
                                    <FormInput
                                        type="number"
                                        isDisabled={type === "view"}
                                        value={values.score}
                                        name="score"
                                        error={touched.score ? errors.score : ""}
                                        placeholder="Nhập điểm..."
                                        onChange={(value) => setFieldValue("score", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={24} xl={24}>
                                <FormGroup title="Tiêu đề dài">
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.title}
                                        name="title"
                                        error={touched.title ? errors.title : ""}
                                        placeholder="Nhập tiêu đề dài..."
                                        onChange={(value) => setFieldValue("title", value)}
                                        onBlur={handleBlur}
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

export default EvaluateForm;
