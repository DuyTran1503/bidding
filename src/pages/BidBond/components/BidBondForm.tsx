import { Formik, Form, FormikProps } from "formik";
import { Row, Col } from "antd";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormDate from "@/components/form/FormDate";
import FormCkEditor from "@/components/form/FormCkEditor";
import dayjs from "dayjs";
import { object, string, number } from "yup";
import { IBidBond } from "@/services/store/bid_bond/bidBond.model";
import { EButtonTypes } from "@/shared/enums/button";
import { IOption } from "@/shared/utils/shared-interfaces";
import FormGroup from "@/components/form/FormGroup";

interface IBidBondFormProps {
  initialValues: IBidBond;
  onSubmit: (data: IBidBond, setErrors: any) => void;
  type: EButtonTypes;
  optionType: IOption[];
  projectOptions: IOption[];
  enterpriseOptions: IOption[];
  formik?: FormikProps<IBidBond>;
  project_id?: number;
}

const stringRegex = /^[\p{L}0-9\s._`-]*$/u;

const BidBondForm = ({ initialValues, onSubmit, type, optionType, projectOptions, enterpriseOptions, formik }: IBidBondFormProps) => {
  const Schema = object().shape({
    project_id: string().matches(stringRegex, "Không được chứa ký tự đặc biệt").required("Vui lòng chọn tên dự án"),
    enterprise_id: string().matches(stringRegex, "Không được chứa ký tự đặc biệt").required("Vui lòng chọn người hoặc tổ chức bảo lãnh"),
    bond_amount: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng nhập số tiền"),
    bond_type: string().matches(stringRegex, "Không được chứa ký tự đặc biệt").required("Vui lòng chọn loại bảo lãnh"),
    bond_number: string().required("Vui lòng nhập mã bảo lãnh"),
    expiry_date: string().required("Vui lòng chọn ngày hết hạn"),
  });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={Schema} innerRef={formik as any}>
      {({ values, handleBlur, errors, touched, setFieldValue }: FormikProps<IBidBond>) => {
        return (
          <Form className="mt-3">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Doanh nghiệp hoặc tổ chức bảo lãnh" required>
                  <FormSelect
                    className="w-100"
                    options={enterpriseOptions}
                    isDisabled={type === "view" || type === "update"}
                    value={values.enterprise_id}
                    id="enterprise_id"
                    error={touched.enterprise_id ? errors.enterprise_id : ""}
                    placeholder="Chọn người hoặc tổ chức bảo lãnh"
                    onChange={(value) => setFieldValue("enterprise_id", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Tên dự án" required>
                  <FormSelect
                    isDisabled={type === "view" || type === "update"}
                    value={values.project_id}
                    id="project_id"
                    placeholder="Tên dự án..."
                    error={touched.project_id ? errors.project_id : ""}
                    onChange={(value) => setFieldValue("project_id", value)}
                    options={projectOptions}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Mã bảo lãnh" required>
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.bond_number}
                    name="bond_number"
                    error={touched.bond_number ? errors.bond_number : ""}
                    placeholder="Nhập mã bảo lãnh..."
                    onChange={(value) => setFieldValue("bond_number", value)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Loại bảo lãnh" required>
                  <FormSelect
                    isDisabled={type === "view"}
                    value={values.bond_type}
                    error={touched.bond_type ? errors.bond_type : ""}
                    id="bond_type"
                    options={optionType}
                    placeholder="Nhập loại bảo lãnh..."
                    onChange={(value) => setFieldValue("bond_type", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8} className="mb-4">
                <FormGroup title="Số tiền bảo lãnh" required>
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.bond_amount}
                    error={touched.bond_amount ? errors.bond_amount : ""}
                    name="bond_amount"
                    placeholder="Nhập số tiền bảo lãnh..."
                    onChange={(value) => setFieldValue("bond_amount", value)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8} className="mb-4">
                <FormGroup title="Ngày phát hành">
                  <FormDate
                    disabled={type === "view"}
                    error={touched.issue_date ? errors.issue_date : ""}
                    value={values.issue_date ? dayjs(values.issue_date) : null}
                    onChange={(date) => setFieldValue("issue_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8} className="mb-4">
                <FormGroup title="Ngày hết hạn" required>
                  <FormDate
                    disabled={type === "view"}
                    error={touched.expiry_date ? errors.expiry_date : ""}
                    minDate={values.issue_date ? dayjs(values.issue_date) : undefined}
                    value={values.expiry_date ? dayjs(values.expiry_date) : null}
                    onChange={(date) => setFieldValue("expiry_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>

              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Ghi chú">
                  <FormCkEditor
                    id="description"
                    direction="vertical"
                    error={touched.description ? errors.description : ""}
                    value={String(values?.description)}
                    setFieldValue={setFieldValue}
                    disabled={type === EButtonTypes.VIEW}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        )

      }}
    </Formik>
  );
};

export default BidBondForm;
