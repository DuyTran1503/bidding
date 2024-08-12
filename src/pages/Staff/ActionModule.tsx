import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import { useEffect, useState } from "react";
import { getAllPermissions, getAllRoles } from "@/services/store/role/role.thunk";
import { FormikRefType } from "@/shared/utils/shared-types";
import lodash from "lodash";
import { IAccountInitialState } from "@/services/store/account/account.slice";
import { Col, Row } from "antd";
import { phoneRegex } from "@/shared/utils/common/function";
import FormSwitch from "@/components/form/FormSwitch";
import { createStaff, updateStaff } from "@/services/store/account/account.thunk";
import FormSelect from "@/components/form/FormSelect";
import { RootStateType } from "@/services/reducers";
import { useSelector } from "react-redux";
import { EPageTypes } from "@/shared/enums/page";
import dayjs from "dayjs";
interface TreeNode {
  title: string;
  key: string;
  id: number | null;
  children?: TreeNode[];
}

interface IAccountFormProps {
  formikRef?: FormikRefType<IStaffFormInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  account?: IStaffFormInitialValues;
}

export interface IStaffFormInitialValues {
  id?: number;
  id_staff?: number;
  staff_id?: number;
  id_user?: number;
  id_role: number[];
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  account_ban_at?: string | null;
  password: "";
  taxcode: number | null;
}

const ActionModule = ({ formikRef, type, account }: IAccountFormProps) => {
  const [loading, setLoading] = useState(false);

  const { dispatch, state } = useArchive<IAccountInitialState>("account");
  const roles = useSelector((state: RootStateType) => state.role.roles);
  const initialValues: IStaffFormInitialValues = {
    name: "",
    id_role: [],
    avatar: "",
    email: "",
    phone: "",
    account_ban_at: "",
    password: "",
    taxcode: null,
  };

  const validationSchema = object().shape({
    name: string()
      .trim()
      .matches(/^[^\d]*$/, "Họ tên không được chứa số")
      .required("Vui lòng nhập họ tên")
      .max(255, "Số ký tự tối đa là 255 ký tự"),
    email: string()
      .trim()
      .required("Vui lòng nhập địa chỉ email")
      .email("Địa chỉ email không hợp lệ")
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Vui lòng nhập lại! định dạng email chưa đúng")
      .max(255, "Số ký tự tối đa là 255 ký tự"),
    phone: string().trim().required("Vui lòng nhập số điện thoại").matches(phoneRegex, "Số điện thoại không hợp lệ"),
    password: string()
      .test("password", "Mật khẩu không hợp lệ", function (value) {
        if (value) {
          const id = this.options.context?.id;
          const item = this.options.context?.item;

          if (!id || !item?.userId) {
            const trimmedPassword = value.trim();

            // Kiểm tra độ dài
            if (trimmedPassword.length < 8) {
              return this.createError({
                path: "password",
                message: "Mật khẩu ít nhất phải có 8 ký tự",
              });
            }

            // Kiểm tra độ phức tạp
            const passwordRegex = /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
            if (!passwordRegex.test(trimmedPassword)) {
              return this.createError({
                path: "password",
                message: "Mật khẩu phải chứa in hoa, in thường, số và ký tự đặc biệt",
              });
            }

            // Kiểm tra ký tự hợp lệ
            const regex = /^[0-9a-zA-Z!@#$%^&*()-_=+\[\]{}|;:'",.<>\/?]+$/;
            if (!regex.test(trimmedPassword)) {
              return this.createError({
                path: "password",
                message: "Mật khẩu chứa ký tự không hợp lệ",
              });
            }

            // Kiểm tra thông tin cá nhân
            const personalInfo = [this.parent.name, this.parent.username, this.parent.phone, this.parent.email];

            for (const info of personalInfo) {
              if (info && typeof info === "string") {
                let normalizedInfo = info.toLowerCase().replace(/\s+/g, "");

                // Xử lý đặc biệt cho email
                if (info === this.parent.email) {
                  const emailParts = normalizedInfo.split("@");
                  if (emailParts.length > 1) {
                    normalizedInfo = emailParts[0];
                  }
                }

                // const normalizedPassword = trimmedPassword.toLowerCase();

                // if (normalizedPassword.includes(normalizedInfo) || calculateSimilarity(normalizedPassword, normalizedInfo) >= 0.9) {
                //   return this.createError({
                //     path: "password",
                //     message: "Mật khẩu không chứa các thông tin gắn liền với người dùng",
                //   });
                // }
              }
            }
          }
        }
        return true;
      })
      .required("Mật khẩu không được để trống"),
  });
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength.toString());
  };

  const editDistance = (s1: string, s2: string): number => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i == 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };
  useEffect(() => {
    dispatch(getAllPermissions());
  }, [dispatch]);
  useEffect(() => {
    if (!loading) {
      dispatch(getAllRoles({ query: state.filter }));
      setLoading(true);
    }
  }, [loading, state.filter]);

  return (
    <Formik
      enableReinitialize
      innerRef={formikRef}
      initialValues={account ?? initialValues}
      validationSchema={validationSchema}
      onSubmit={(data) => {
        const body = {
          ...lodash.omit(data, "id_user"),
          account_ban_at: data.account_ban_at ? new Date().toISOString() : null,
          role_id: data.id_role,
        };

        const { id_role, ...newObj } = body;
        if (type === EPageTypes.CREATE) {
          const newValue = { ...newObj, account_ban_at: dayjs(body.account_ban_at).format(" YYYY-MM-DD HH:mm:ss") };
          return dispatch(createStaff({ body: newValue as any }));
        }
        if (type === EPageTypes.UPDATE) {
          const newValue = {
            role_id: body.id_role,
            id_staff: body.staff_id,
            name: body.name,
            phone: body.phone,
            email: body.email,
            avatar: body.avatar,
            id_user: body.id,
            taxcode: body.taxcode,
            account_ban_at: body.account_ban_at ? new Date().toISOString() : null,
          };
          return dispatch(updateStaff({ body: newValue, param: String(newValue?.id_user) }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
          <Form>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Tên tài khoản">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.name ?? ""}
                    name="name"
                    error={touched.name ? errors.name : ""}
                    placeholder="Nhập tên tài khoản..."
                    onChange={(value) => {
                      setFieldValue("name", value);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Email">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.email ?? ""}
                    name="email"
                    error={touched.email ? errors.email : ""}
                    placeholder="Nhập email..."
                    onChange={(value) => {
                      setFieldValue("email", value);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Số điện thoại">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.phone ?? ""}
                    name="phone"
                    error={touched.phone ? errors.phone : ""}
                    placeholder="Nhập số điện thoại..."
                    onChange={(value) => {
                      setFieldValue("phone", value);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              {type === EPageTypes.CREATE && (
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Password">
                    <FormInput
                      type="password"
                      value={values.password ?? ""}
                      name="password"
                      error={touched.password ? errors.password : ""}
                      placeholder="Nhập mật khẩu..."
                      onChange={(value) => {
                        setFieldValue("password", value);
                      }}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
              )}
            </Row>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} xl={24}></Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Vai trò">
                  <FormSelect
                    isMultiple={true}
                    onChange={(value) => setFieldValue("id_role", value)}
                    options={roles.map((role) => ({ label: role.name, value: role.id }))}
                    defaultValue={!!values.id_role && values.id_role}
                    placeholder="Chọn vai trò "
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Mã số thuế">
                  <FormInput
                    type="number"
                    isDisabled={type === "view"}
                    value={values.taxcode ?? ""}
                    name="taxcode"
                    error={touched.taxcode ? errors.taxcode : ""}
                    placeholder="Nhập mã số thuế..."
                    onChange={(value) => {
                      setFieldValue("taxcode", value);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Trạng thái hoạt động">
                <FormSwitch
                  checked={!!values.account_ban_at ? true : false}
                  onChange={(value) => {
                    setFieldValue("account_ban_at", value);
                  }}
                />
              </FormGroup>
            </Col>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ActionModule;
