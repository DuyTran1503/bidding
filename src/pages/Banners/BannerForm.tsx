import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Form, Formik, FormikProps } from "formik";
import lodash from "lodash";
import { IBannerInitialState } from "@/services/store/banner/banner.slice";
import { IBanner } from "@/services/store/banner/banner.model";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import { createBanner, updateBanner } from "@/services/store/banner/banner.thunk";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";

interface IBannerFormProps {
    type?: EButtonTypes;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    item?: IBanner;
}

export interface IBannerValues {
    id: string;
    name: string;
    path?: File;
    is_active: string;
}

const BannerForm = ({ visible, type, setVisible, item }: IBannerFormProps) => {
    const formikRef = useRef<FormikProps<IBanner>>(null);
    const { state, dispatch } = useArchive<IBannerInitialState>("banner");
    const initialValues: IBanner = {
        id: item?.id || "",
        name: item?.name || "",
        path: item?.path ?? undefined,
        is_active: item?.is_active ? "1" : "0",
    };
    const handleSubmit = (data: IBanner) => {
        const body = {
            ...lodash.omit(data, "key", "index"),
        };

        if (type === EButtonTypes.CREATE) {
            // Tạo mới banner
            dispatch(createBanner(body as Omit<IBanner, "id">));
        } else if (type === EButtonTypes.UPDATE && item?.id) {
            // Kiểm tra xem path có thay đổi hoặc bị xóa không
            let newData;
            if (!body.path) {
                // Nếu path bị xóa, gửi path là null hoặc loại bỏ tùy theo yêu cầu của backend
                newData = { ...lodash.omit(body, "path"), path: null };
            } else if (item.path !== body.path) {
                // Nếu path đã thay đổi, giữ nguyên giá trị path mới trong newData
                newData = body;
            } else {
                // Nếu path không thay đổi, loại bỏ path khỏi newData
                newData = lodash.omit(body, "path");
            }

            // Cập nhật banner
            dispatch(updateBanner({ body: newData, param: item.id }));
        }
    };

    useEffect(() => {
        if (state.status === EFetchStatus.FULFILLED) {
            setVisible(false);
        }
    }, [state.status]);
    return (
        <Dialog
            handleSubmit={() => {
                formikRef.current && formikRef.current.handleSubmit();
            }}
            visible={visible}
            setVisible={setVisible}
            title={
                type === EButtonTypes.CREATE
                    ? "Tạo mới banner"
                    : type === EButtonTypes.UPDATE
                        ? "Cập nhật Tạo mới banner"
                        : "Chi tiết Tạo mới banner"
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
                {({ values, handleBlur, setFieldValue }) => (
                    <Form className="mt-3">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={24} md={24} xl={24}>
                                <FormGroup title="Tên Banner">
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.name}
                                        name="name"
                                        placeholder="Nhập tên Banner..."
                                        onChange={(value) => setFieldValue("name", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={24} xl={24}>
                                <FormGroup title="Hình ảnh">
                                    <FormUploadFile
                                        isMultiple={false}
                                        value={values.path}
                                        onChange={(e: any) => {
                                            setFieldValue("path", e);
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={24} xl={24}>
                                <FormGroup title="Trạng thái">
                                    <FormSwitch
                                        checked={values.is_active === "1"}
                                        onChange={(value) => {
                                            setFieldValue("is_active", value ? "1" : "0");
                                        }}
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

export default BannerForm;
