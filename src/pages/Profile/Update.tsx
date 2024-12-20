import Button from "@/components/common/Button";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormDate from "@/components/form/FormDate";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormRadio from "@/components/form/FormRadio";
import FormSelect from "@/components/form/FormSelect";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IIndustryInitialState } from "@/services/store/industry/industry.slice";
import { getIndustries } from "@/services/store/industry/industry.thunk";
import { IEditProfile } from "@/services/store/profile/profile.model";
import { IEditProfileInitialState, resetStatus } from "@/services/store/profile/profile.slice";
import { getEditProfile, updateEditProfile } from "@/services/store/profile/profile.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { mappingTypeEnterprise, typeEnterpriseEnumArray } from "@/shared/enums/typeEnterprise";
import { IOption } from "@/shared/utils/shared-interfaces";
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
  const { state: industryState, dispatch: dispatchIndustry } = useArchive<IIndustryInitialState>("industry");

  const initialValues: IEditProfile = {
    id: item?.id || "",
    account_type: item?.account_type || state.editProfiles?.profile?.account_type,
    name: item?.name || state.editProfiles?.name,
    phone: item?.phone || state.editProfiles?.profile?.phone,
    avatar: item?.avatar || state.editProfiles?.profile?.avatar,
    birthday: item?.birthday || state.editProfiles?.profile?.birthday,
    gender: item?.gender || state.editProfiles?.profile?.gender,
    representative: item?.representative || state.editProfiles?.profile?.representative,
    address: item?.address || state.editProfiles?.profile?.address,
    website: item?.website || state.editProfiles?.profile?.website,
    establish_date: item?.establish_date || state.editProfiles?.profile?.establish_date,
    registration_date: item?.registration_date || state.editProfiles?.profile?.registration_date,
    registration_number: item?.registration_number || state.editProfiles?.profile?.registration_number,
    organization_type: item?.organization_type || state.editProfiles?.profile?.organization_type,
    industry_id: item?.industry_id || state.editProfiles?.profile?.industry_id,
    description: item?.description || state.editProfiles?.profile?.description,
  };
  const handleSubmit = (data: IEditProfile) => {
    const newData: IEditProfile = {
      id: data.id,
      email: state.editProfiles?.email,
      taxcode: state.editProfiles?.taxcode,
      account_type: state.editProfiles?.account_type,
      name: data.name,
      phone: data.phone,
    };

    if (state.editProfiles?.account_type !== "enterprise") {
      newData.gender = data.gender;
      newData.birthday = data.birthday;
    }

    if (state.editProfiles?.account_type !== "staff") {
      newData.representative = data.representative;
      newData.address = data.address;
      newData.website = data.website;
      newData.establish_date = data.establish_date;
      newData.registration_number = data.registration_number;
      newData.organization_type = data.organization_type;
      newData.industry_id = data.industry_id;
      newData.description = data.description;
      newData.registration_date = data.registration_date;
    }

    if (data.avatar !== state.editProfiles?.profile?.avatar) {
      newData.avatar = data.avatar;
    }

    dispatch(updateEditProfile({ body: newData, param: String(newData?.id) }));
  };

  const typeOptions: IOption[] = typeEnterpriseEnumArray.map((e) => ({
    value: e,
    label: mappingTypeEnterprise[e],
  }));
  const optionsIndustry: IOption[] = industryState?.listIndustry!.map((e) => ({
    value: e.id,
    label: e.name,
  }));
  useEffect(() => {
    dispatch(getEditProfile({}));
    dispatchIndustry(getIndustries());
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
            {state.editProfiles?.account_type !== "enterprise" && (
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
            )}
            {state.editProfiles?.account_type !== "staff" && (
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} xl={12}>
                  <FormGroup title="Họ và tên doanh nghiệp" required>
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
                  <FormGroup title="Người đại diện" required>
                    <FormInput
                      type="text"
                      isDisabled={type === EButtonTypes.VIEW}
                      value={values.representative}
                      name="representative"
                      error={touched.representative ? errors.representative : ""}
                      placeholder="Nhập tên..."
                      onChange={(value) => setFieldValue("representative", value)}
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
                  <FormGroup title="Địa chỉ" required>
                    <FormInput
                      type="text"
                      isDisabled={type === EButtonTypes.VIEW}
                      value={values.address}
                      name="address"
                      error={touched.address ? errors.address : ""}
                      placeholder="Nhập địa chỉ..."
                      onChange={(value) => setFieldValue("address", value)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12}>
                  <FormGroup title="Địa chỉ website">
                    <FormInput
                      type="text"
                      isDisabled={type === EButtonTypes.VIEW}
                      value={values.website}
                      name="website"
                      error={touched.website ? errors.website : ""}
                      placeholder="Nhập địa chỉ website..."
                      onChange={(value) => setFieldValue("website", value)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12}>
                  <FormGroup title="Số đăng ký">
                    <FormInput
                      type="text"
                      isDisabled={type === EButtonTypes.VIEW}
                      value={values.registration_number}
                      name="registration_number"
                      error={touched.registration_number ? errors.registration_number : ""}
                      placeholder="Nhập số đăng ký..."
                      onChange={(value) => setFieldValue("registration_number", value)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12}>
                  <FormGroup title="Loại hình tổ chức">
                    <FormSelect
                      isDisabled={type === EButtonTypes.VIEW}
                      placeholder="Chọn..."
                      value={typeOptions?.find((e) => e.value == values.organization_type)?.label}
                      id="organization_type"
                      onChange={(value) => {
                        setFieldValue("organization_type", value);
                      }}
                      options={typeOptions}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12}>
                  <FormGroup title="Lĩnh vực kinh doanh">
                    <FormSelect
                      options={optionsIndustry}
                      isDisabled={type === EButtonTypes.VIEW}
                      placeholder="Chọn..."
                      isMultiple
                      value={values.profile?.industries?.map((item) => item.id)}
                      defaultValue={state.editProfiles?.profile.industries?.map((item: any) => item.id)}
                      id="industry_id"
                      onChange={(value) => {
                        setFieldValue("industry_id", value);
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12}>
                  <FormGroup title="Ngày thành lập" required>
                    <FormDate
                      disabled={type === EButtonTypes.VIEW}
                      value={values.establish_date ? dayjs(values.establish_date) : null}
                      onChange={(date) => setFieldValue(".establish_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12}>
                  <FormGroup title="Ngày đăng ký" required>
                    <FormDate
                      disabled={type === EButtonTypes.VIEW}
                      value={values.registration_date ? dayjs(values.registration_date) : null}
                      onChange={(date) => setFieldValue(".registration_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={24} xl={24}>
                  <FormGroup title="Mô tả">
                    <FormCkEditor id={"description"} value={values.description ?? ""} onChange={(e) => setFieldValue("description", e)} />
                  </FormGroup>
                </Col>
              </Row>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Update;
