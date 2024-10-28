import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import { useEffect, useState } from "react";
import { getAllPermissions, getAllRoles } from "@/services/store/role/role.thunk";
import { FormikRefType } from "@/shared/utils/shared-types";
import lodash from "lodash";
import { IEmployeeInitialState } from "@/services/store/employee/employee.slice";
import { Col, RadioChangeEvent, Row } from "antd";
import { phoneRegex } from "@/shared/utils/common/function";
import FormSwitch from "@/components/form/FormSwitch";
import { createEmployee, updateEmployee } from "@/services/store/employee/employee.thunk";
import FormSelect from "@/components/form/FormSelect";
import { RootStateType } from "@/services/reducers";
import { useSelector } from "react-redux";
import { EPageTypes } from "@/shared/enums/page";
import dayjs from "dayjs";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import FormDate from "@/components/form/FormDate";
import FormRadio from "@/components/form/FormRadio";
import { mappingGender, statusEnumArray } from "@/shared/enums/gender";
import { IOption } from "@/shared/utils/shared-interfaces";
import { IEmployee } from "@/services/store/employee/employee.model";
import Employee from ".";
import { TypeEmployee } from "@/shared/enums/types";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { convertDataOptions } from "../Project/helper";
import { educationLevelEnumArray, mappingEducationLevel } from "@/shared/enums/level";
// interface TreeNode {
//   title: string;
//   key: string;
//   id: number | null;
//   children?: TreeNode[];
// }

interface IEmployeeFormProps {
  formikRef?: FormikRefType<IEmployee>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  employee?: IEmployee;
}

const ActionModule = ({ formikRef, type, employee }: IEmployeeFormProps) => {
  const [loading, setLoading] = useState(false);

  const { dispatch, state } = useArchive<IEmployeeInitialState>("employee");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");

  const roles = useSelector((state: RootStateType) => state.role.roles);
  const initialValues: IEmployee = {
    id: employee?.id ?? "",
    enterprise_id: employee?.enterprise_id ?? "",
    code: employee?.code ?? "",
    avatar: employee?.avatar ?? undefined, // Assuming it's nullable
    name: employee?.name ?? "",
    phone: employee?.phone ?? "",
    email: employee?.email ?? "",
    birthday: employee?.birthday ?? "",
    gender: employee?.gender ?? "",
    taxcode: employee?.taxcode ?? "",
    educational_level: employee?.educational_level ?? undefined, // Default value
    start_date: employee?.start_date ?? "",
    end_date: employee?.end_date ?? "",
    salary: employee?.salary ?? "", // Assuming salary is a string
    address: employee?.address ?? "",
    status: employee?.status ?? undefined, // Default value
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
  });
  const genderOptions: IOption[] = statusEnumArray.map((key) => ({
    value: key,
    label: mappingGender[key],
  }));
  useEffect(() => {
    dispatchEnterprise(getListEnterprise());
  }, []);
  const optionEducation: IOption[] = educationLevelEnumArray.map((e) => ({
    label: mappingEducationLevel[e],
    value: e,
  }));
  return (
    <Formik
      enableReinitialize
      innerRef={formikRef}
      initialValues={employee ?? initialValues}
      validationSchema={validationSchema}
      onSubmit={(data) => {
        const body = {
          ...lodash.omit(data, "id"),
          // employee_ban_at: data.employee_ban_at ? new Date().toISOString() : null,
          // role_id: data.id_role,
        };
        /* eslint-disable @typescript-eslint/no-unused-vars */
        if (type === EPageTypes.CREATE) {
          return dispatch(createEmployee(body as any));
        }
        if (type === EPageTypes.UPDATE) {
          const payload = employee?.avatar === body.avatar ? (({ avatar, ...rest }) => rest)(body) : body;
          return dispatch(updateEmployee({ body: payload, param: String(employee?.id) }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
          <Form>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Tên nhân viên">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.name ?? ""}
                    name="name"
                    error={touched.name ? errors.name : ""}
                    placeholder="Nhập tên nhân viên..."
                    onChange={(value) => {
                      setFieldValue("name", value);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Mã nhân viên">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.code ?? ""}
                    name="code"
                    error={touched.code ? errors.code : ""}
                    placeholder="Nhập mã nhân viên..."
                    onChange={(value) => {
                      setFieldValue("code", value);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8} className="mb-4">
                <FormGroup title=" Công ty">
                  <FormSelect
                    label=" Công ty"
                    placeholder="Chọn công ty..."
                    id="enterprise_id"
                    value={values.enterprise_id}
                    onChange={(e) => setFieldValue("enterprise_id", e)}
                    options={convertDataOptions(stateEnterprise.listEnterprise || [])}
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
            </Row>
            <Row gutter={[24, 0]} className="justify-end">
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

              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <Row gutter={[12, 0]}>
                  <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                    <FormGroup title="Giới tính" className="gap-[6px]">
                      <FormRadio
                        options={genderOptions}
                        value={values.gender && (genderOptions.find((item) => +item.value === +values.gender)?.value as string)}
                        onChange={(e: RadioChangeEvent) => setFieldValue("gender", e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Ngày sinh">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    label="Ngày sinh"
                    value={values.birthday ? dayjs(values.birthday) : null}
                    onChange={(date) => setFieldValue("birthday", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8} className="mb-4">
                <FormGroup title="Ngày bắt đầu ">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    label="Ngày bắt đầu "
                    value={values.start_date ? dayjs(values.start_date) : null}
                    onChange={(date) => setFieldValue("start_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8} className="mb-4">
                <FormGroup title="Ngày kết thúc ">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    label="Ngày kết thúc "
                    minDate={values.start_date ? dayjs(values.start_date) : undefined}
                    value={values.end_date ? dayjs(values.end_date) : null}
                    onChange={(date) => setFieldValue("end_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Ảnh đại diện">
                  <FormSelect
                    isDisabled={type === "view"}
                    label="Task làm việc"
                    value={values.status}
                    options={optionEducation}
                    id="status"
                    placeholder="Chọn mức độ..."
                    onChange={(value) => setFieldValue("status", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Ảnh đại diện">
                  <FormUploadFile
                    isMultiple={false}
                    value={values.avatar}
                    onChange={(e: any) => {
                      setFieldValue("avatar", e);
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ActionModule;
