import Button from "@/components/common/Button";
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
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import { Formik } from "formik";
import { useEffect } from "react";
import { Link } from "react-router-dom";

interface IIEditProfileFormProps {
  formikRef?: any;
  type?: EButtonTypes;
  item?: IEditProfile;
}
const Update = ({ formikRef, type, item }: IIEditProfileFormProps) => {
  const { state, dispatch } = useArchive<IEditProfileInitialState>("edit_profile");
  const initialValues: IEditProfile = {
    id: item?.id || "",
    account_type: item?.account_type || state.editProfiles?.profile?.account_type,
    name: item?.name || state.editProfiles?.name,
    phone: item?.phone || state.editProfiles?.profile?.phone,
    avatar: item?.avatar || state.editProfiles?.profile?.avatar,
    birthday: item?.birthday || state.editProfiles?.profile?.birthday,
    gender: item?.gender || state.editProfiles?.profile?.gender,
  };
  const handleSubmit = (data: IEditProfile) => {

    const newData: IEditProfile = {
      id: data.id,
      email: state.editProfiles?.email,
      taxcode: state.editProfiles?.taxcode,
      account_type: state.editProfiles?.account_type,
      name: data.name,
      phone: data.phone,
      birthday: data.birthday,
      gender: data.gender,
    };

    if (data.avatar !== state.editProfiles?.profile?.avatar) {
      newData.avatar = data.avatar;
    }

    dispatch(updateEditProfile({ body: newData, param: String(newData?.id) }));

  };

  useEffect(() => {
    dispatch(getEditProfile({}));
  }, []);
  useFetchStatus({
    module: "edit_profile",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/profile",
      },
      error: { message: state.message },
    },
  });
  return (
    <div className="max-w-screen-xl">
      <Formik innerRef={formikRef} initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
        {({ values, handleBlur, handleSubmit, setFieldValue, touched, errors }) => (
          <form className="my-5 space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <div className="mt-5 flex items-center text-2xl font-semibold">Cập nhập thông tin cá nhân</div>
              <div className="flex items-center justify-center gap-4">
                <Link to={`/profile`} className="font-semiboldy rounded-lg border border-red-400 px-4 py-1 text-red-400">
                  Quay lại
                </Link>
                <Button text="Cập nhật" isLoading={state.status === EFetchStatus.PENDING} />
              </div>
            </div>
            <Row gutter={[16, 16]} className="justify-center">
              <Col xs={24} sm={24} md={8} xl={8}>
                <FormGroup title="Ảnh đại diện">
                  <FormUploadFile
                    disabled={type === "view"}
                    isMultiple={false}
                    value={values.avatar}
                    onChange={(e: any) => setFieldValue("avatar", e)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
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
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue("gender", Number(value));
                    }}
                    options={[
                      { value: 1, label: "Nam" },
                      { value: 2, label: "Nữ" },
                    ]}
                    value={values.gender as string}
                  />
                </FormGroup>
              </Col>
            </Row>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Update;
