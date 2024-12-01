import FormDate from "@/components/form/FormDate";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormRadio from "@/components/form/FormRadio";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IEditProfile } from "@/services/store/profile/profile.model";
import { IEditProfileInitialState, resetStatus } from "@/services/store/profile/profile.slice";
import { getEditProfile, updateEditProfile } from "@/services/store/profile/profile.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { Button, Col, Form, Row } from "antd";
import { Formik } from "formik";
import { AiFillCaretRight } from "react-icons/ai";
import dayjs from "dayjs";
import { useEffect } from "react";

interface IIEditProfileFormProps {
    formikRef?: any;
    type?: EButtonTypes;
    item?: IEditProfile;
}
const Update = ({ formikRef, type, item }: IIEditProfileFormProps) => {
    const { state, dispatch } = useArchive<IEditProfileInitialState>("edit_profile");
    const initialValues: IEditProfile = {
        id: item?.id || "",
        account_type: item?.account_type || state.editProfiles?.profile?.avatar,
        name: item?.name || state.editProfiles?.name,
        phone: item?.phone || state.editProfiles?.profile?.phone,
        avatar: item?.avatar || state.editProfiles?.profile?.avatar,
        birthday: item?.birthday || state.editProfiles?.profile?.birthday,
        gender: item?.gender || state.editProfiles?.profile?.gender,
    };
    const handleSubmit = (data: IEditProfile) => {

        const newData = {
            id: data.id,
            account_type: data.account_type,
            name: data.name,
            phone: data.phone,
            avatar: data.avatar,
            birthday: data.birthday,
            gender: data.gender,
        };
        const { avatar, ...rest } = newData;
        const payload = item?.avatar === avatar ? rest : newData;

        dispatch(updateEditProfile({ body: payload, param: String(newData?.id) }));
    };

    useEffect(() => {
        dispatch(getEditProfile({}));
    }, []);
    useFetchStatus({
        module: "edit_profile",
        reset: resetStatus,
        actions: {
            success: { message: state.message },
            error: { message: state.message },
        },
    });
    return (
        <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center text-2xl font-semibold mt-5">
                <AiFillCaretRight />Cập nhập thông tin cá nhân
            </div>
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={handleSubmit}>
                {({ values, handleBlur, setFieldValue, touched, errors }) => (
                    <Form className="mt-3 ">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={24} md={24} xl={24}>
                                <FormGroup title="Ảnh đại diện">
                                    <FormUploadFile
                                        isMultiple={false}
                                        value={values.avatar}
                                        onChange={(e: any) => setFieldValue("document", e)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Họ và tên" required>
                                    <FormInput
                                        type="text"
                                        isDisabled={type === EButtonTypes.VIEW}
                                        value={values.name}
                                        name="name"
                                        error={touched.name ? errors.name : ""}
                                        placeholder="Nhập tên..."
                                        onChange={(value) => setFieldValue("name", value)}
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
                                <FormGroup title="Ngày tháng năm sinh" required>
                                    <FormDate
                                        disabled={type === EButtonTypes.VIEW}
                                        minDate={values.birthday ? dayjs(values.birthday) : undefined}
                                        value={values.birthday ? dayjs(values.birthday) : null}
                                        onChange={(date) => setFieldValue(".birthday", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Giới tính" required>
                                    <FormRadio
                                        onChange={(value) => setFieldValue("type", Number(value))}
                                        options={[
                                            { value: 1, label: "Nam" },
                                            { value: 2, label: "Nữ" },
                                        ]}
                                        value={values.gender as string}
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
    )
}

export default Update