import FormDate from "@/components/form/FormDate";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormRadio from "@/components/form/FormRadio";
import FormSelect from "@/components/form/FormSelect";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { useArchive } from "@/hooks/useArchive";
import { IEmployee } from "@/services/store/employee/employee.model";
import { IEmployeeInitialState } from "@/services/store/employee/employee.slice";
import { createEmployee, updateEmployee } from "@/services/store/employee/employee.thunk";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { mappingGender, statusEnumArray } from "@/shared/enums/gender";
import { educationLevelEnumArray, mappingEducationLevel } from "@/shared/enums/level";
import { EPageTypes } from "@/shared/enums/page";
import { employeeEnumArray, mappingEmployee } from "@/shared/enums/types";
import { phoneRegex } from "@/shared/utils/common/function";
import { IOption } from "@/shared/utils/shared-interfaces";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, RadioChangeEvent, Row } from "antd";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import lodash from "lodash";
import { useEffect } from "react";
import { object, string } from "yup";
import { convertDataOptions } from "../Project/helper";
// interface TreeNode {
//   title: string;
//   key: string;
//   id: number | null;
//   children?: TreeNode[];
// }

interface IEmployeeFormProps {
  formikRef?: FormikRefType<IEmployee>;
  type: EPageTypes;
  employee?: IEmployee;
}

const ActionModule = ({ formikRef, type, employee }: IEmployeeFormProps) => {
  const { dispatch } = useArchive<IEmployeeInitialState>("employee");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");

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
    education_level: employee?.education_level ?? undefined, // Default value
    start_date: employee?.start_date ?? "",
    end_date: employee?.end_date ?? "",
    salary: employee?.salary ?? "", // Assuming salary is a string
    address: employee?.address ?? "",
    status: employee?.status ?? undefined, // Default value
  };
  const validationSchema = object().shape({
    name: string().trim()
      .matches(/^[^\d]*$/, "Họ tên không được chứa số")
      .required("Vui lòng nhập họ tên")
      .max(255, "Số ký tự tối đa là 255 ký tự"),
    code: string().trim().required("Vui lòng nhập mã nhân viên")
      .max(255, "Số ký tự tối đa là 255 ký tự"),
    email: string().trim()
      .required("Vui lòng nhập địa chỉ email")
      .email("Địa chỉ email không hợp lệ")
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Vui lòng nhập lại! định dạng email chưa đúng")
      .max(255, "Số ký tự tối đa là 255 ký tự"),
    phone: string().trim().required("Vui lòng nhập số điện thoại").matches(phoneRegex, "Số điện thoại không hợp lệ"),
    taxcode: string().trim().required("Vui lòng nhập mã số thuế").max(255, "Số ký tự tối đa là 255 ký tự"),
    gender: string().required("Vui lòng chọn giới tính"),
    enterprise_id: string().required("Vui lòng chọn công ty làm việc"),
    status: string().required("Vui lòng chọn trạng thái làm việc"),
    education_level: string().required("Vui lòng chọn trình độ học vấn"),
  });

  const genderOptions: IOption[] = statusEnumArray.map((key) => ({
    value: key,
    label: mappingGender[key],
  }));

  const optionEducation: IOption[] = educationLevelEnumArray.map((e) => ({
    label: mappingEducationLevel[e],
    value: e,
  }));
  const optionStatus: IOption[] = employeeEnumArray.map((e) => ({
    label: mappingEmployee[e],
    value: e,
  }));
  useEffect(() => {
    dispatchEnterprise(getListEnterprise());
  }, [dispatchEnterprise]);
  return (
    <Formik
      enableReinitialize
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(data, { setErrors }) => {
        const body = {
          ...lodash.omit(data, "id"),
        };
        if (type === EPageTypes.CREATE) {
          return dispatch(createEmployee(body as any))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        }
        if (type === EPageTypes.UPDATE) {
          const payload = employee?.avatar === body.avatar ? (({ ...rest }) => rest)(body) : body;
          return dispatch(updateEmployee({ body: payload, param: String(employee?.id) }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
          <Form>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Tên nhân viên" required>
                  <FormInput
                    type="text"
                    isDisabled={type === EPageTypes.VIEW}
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Mã nhân viên" required>
                  <FormInput
                    type="text"
                    isDisabled={type === EPageTypes.VIEW}
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title=" Công ty làm việc" required>
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn công ty..."
                    id="enterprise_id"
                    error={touched.enterprise_id ? errors.enterprise_id : ""}
                    value={values.enterprise_id || undefined}
                    onChange={(e) => setFieldValue("enterprise_id", e)}
                    options={convertDataOptions(stateEnterprise.listEnterprise || [])}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Email" required>
                  <FormInput
                    type="text"
                    isDisabled={type === EPageTypes.VIEW}
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Số điện thoại" required>
                  <FormInput
                    type="text"
                    isDisabled={type === EPageTypes.VIEW}
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Mã số thuế" required>
                  <FormInput
                    type="number"
                    isDisabled={type === EPageTypes.VIEW}
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Mức lương">
                  <FormInput
                    type="number"
                    isDisabled={type === EPageTypes.VIEW}
                    value={values.salary ?? ""}
                    name="salary"
                    error={touched.salary ? errors.salary : ""}
                    placeholder="Nhập mức lương..."
                    onChange={(value) => {
                      setFieldValue("salary", value);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Ngày sinh">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    error={touched.birthday ? errors.address : ""}
                    value={values.birthday ? dayjs(values.birthday) : null}
                    onChange={(date) => setFieldValue("birthday", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Địa chỉ">
                  <FormInput
                    type="text"
                    isDisabled={type === EPageTypes.VIEW}
                    value={values.address ?? ""}
                    name="address"
                    error={touched.address ? errors.address : ""}
                    placeholder="Nhập địa chỉ..."
                    onChange={(value) => {
                      setFieldValue("address", value);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Ngày bắt đầu">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    error={touched.start_date ? errors.start_date : ""}
                    value={values.start_date ? dayjs(values.start_date) : null}
                    onChange={(date) => setFieldValue("start_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Ngày kết thúc">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    error={touched.start_date ? errors.start_date : ""}
                    minDate={values.start_date ? dayjs(values.start_date) : undefined}
                    value={values.end_date ? dayjs(values.end_date) : null}
                    onChange={(date) => setFieldValue("end_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>

              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Trình độ học vấn" required>
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    value={values.education_level}
                    defaultValue={values.education_level}
                    options={optionEducation}
                    error={touched.education_level ? errors.education_level : ""}
                    id="education_level"
                    placeholder="Chọn mức độ..."
                    onChange={(value) => setFieldValue("education_level", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Giới tính" className="gap-[6px]" required>
                  <FormRadio
                    isDisabled={type === EPageTypes.VIEW}
                    options={genderOptions}
                    error={touched.gender ? errors.gender : ""}
                    value={values.gender && (genderOptions.find((item) => +item.value === +values.gender)?.value as string)}
                    onChange={(e: RadioChangeEvent) => setFieldValue("gender", e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Trạng thái làm việc" required>
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    value={values.status}
                    error={touched.status ? errors.status : ""}
                    options={optionStatus}
                    id="status"
                    placeholder="Chọn mức độ..."
                    onChange={(value) => setFieldValue("status", value)}
                  />
                </FormGroup>
              </Col>

              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Ảnh đại diện">
                  <FormUploadFile
                    error={touched.avatar ? errors.avatar : ""}
                    disabled={type === EPageTypes.VIEW}
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
