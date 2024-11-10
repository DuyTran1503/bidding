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
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
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
      onSubmit={(data) => {
        const body = {
          ...lodash.omit(data, "id"),
        };
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Tên nhân viên">
                  <FormInput
                    type="text"
                    label="Tên nhân viên"
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Mã nhân viên">
                  <FormInput
                    label="Mã nhân viên"
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title=" Công ty làm việc">
                  <FormSelect
                    label="Công ty làm việc"
                    placeholder="Chọn công ty..."
                    id="enterprise_id"
                    value={values.enterprise_id || undefined}
                    onChange={(e) => setFieldValue("enterprise_id", e)}
                    options={convertDataOptions(stateEnterprise.listEnterprise || [])}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Email">
                  <FormInput
                    label="Email"
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Số điện thoại">
                  <FormInput
                    label="Số điện thoại"
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Mã số thuế">
                  <FormInput
                    label="Mã số thuế"
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
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Mức lương">
                  <FormInput
                    label="Mức lương"
                    type="number"
                    isDisabled={type === "view"}
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
                    label="Ngày sinh"
                    value={values.birthday ? dayjs(values.birthday) : null}
                    onChange={(date) => setFieldValue("birthday", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Địa chỉ">
                  <FormInput
                    label="Địa chỉ"
                    type="text"
                    isDisabled={type === "view"}
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
                <FormGroup title="Ngày bắt đầu ">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    label="Ngày bắt đầu "
                    value={values.start_date ? dayjs(values.start_date) : null}
                    onChange={(date) => setFieldValue("start_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
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

              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Trình độ học vấn">
                  <FormSelect
                    isDisabled={type === "view"}
                    label="Trình độ học vấn"
                    value={values.education_level}
                    options={optionEducation}
                    id="education_level"
                    placeholder="Chọn mức độ..."
                    onChange={(value) => setFieldValue("education_level", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Giới tính" className="gap-[6px]">
                  <FormRadio
                    title="Giới tính"
                    options={genderOptions}
                    value={values.gender && (genderOptions.find((item) => +item.value === +values.gender)?.value as string)}
                    onChange={(e: RadioChangeEvent) => setFieldValue("gender", e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={8} xl={8} className="mb-4">
                <FormGroup title="Trạng thái làm việc">
                  <FormSelect
                    isDisabled={type === "view"}
                    label="Trạng thái làm việc"
                    value={values.status}
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
