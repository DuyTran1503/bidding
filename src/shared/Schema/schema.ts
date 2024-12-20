import * as Yup from "yup";

const phoneRegExp = /^(?:\+84|84|0)?[-\s]*(?:\((?:2[48]|[235789]\d|024)\)\s*|\d{2,3})[-\s]*\d{3,4}[-\s]*\d{4}$/;
const stringRegex = /^[\p{L}0-9\s._,`-]*$/u;
const numberRegex = /^[0-9]+$/;

// Banner
export const schemaBanner = Yup.object().shape({
  name: Yup.string().trim().required("Tên là bắt buộc"),
  path: Yup.string().required("Ảnh là bắt buộc"),
});
// =======> Project

// Project
export const schemaProject = Yup.object().shape({
  parent_id: Yup.number().nullable(),
  name: Yup.string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt").required("Tên dự án là bắt buộc"),
  staff_id: Yup.number().moreThan(0, "Giá trị phải lớn hơn 0").required("Người phê duyệt là bắt buộc"),
  industry_id: Yup.array().min(1, "Vui lòng chọn ít nhất một ngành nghề").required("Vui lòng không để trống trường này"),
  investor_id: Yup.string().required("Vui lòng không để trống trường này"),
  procurement_id: Yup.array().min(1, "Vui lòng chọn ít nhất một dịch vụ").required("Vui lòng không để trống trường này"),
  tenderer_id: Yup.string().required("Vui lòng không để trống trường này"),
  selection_method_id: Yup.string().required("Vui lòng không để trống trường này"),
  submission_method: Yup.string().required("Vui lòng không để trống trường này"),
  location: Yup.string().matches(stringRegex, "Không được chứa ký tự đặc biệt").required("Địa điểm là bắt buộc"),
  funding_source_id: Yup.string().required("Vui lòng không để trống trường này"),
  decision_number_issued: Yup.string().required("Vui lòng không để trống trường này"),
  // attached_documents: Yup.array().min(1, "Vui lòng chọn ít nhất một tài liệu đính kèm"),
  start_time: Yup.date().required("Thời gian bắt đầu là bắt buộc"),
  end_time: Yup.date().required("Thời gian kết thúc là bắt buộc"),
  bid_submission_start: Yup.date().required("Thời gian kết thúc là bắt buộc"),
  bid_submission_end: Yup.date().required("Thời gian kết thúc là bắt buộc"),
  // status: Yup.string()
  //     .matches(stringRegex, "Không được chứa ký tự đặc biệt")
  //     .required("Trạng thái là bắt buộc"),
  total_amount: Yup.string()
    .matches(numberRegex, "Trường này chỉ cho phép là số")
    .required("Tổng số tiền là bắt buộc")
    .test("is-positive", "Phải lớn hơn 0", (value) => {
      const num = Number(value);
      return num > 0;
    }),
  amount: Yup.string()
    .matches(numberRegex, "Trường này chỉ cho phép là số")
    .required("Số tiền là bắt buộc")
    .test("is-positive", "Phải lớn hơn 0", (value) => {
      const num = Number(value);
      return num > 0;
    }),
});

// BidBond
export const schemaBidBond = Yup.object().shape({
  project_id: Yup.string().required("Tên dự án là bắt buộc"),
  enterprise_id: Yup.string().required("Người hoặc tổ chức bảo lãnh là bắt buộc"),
  bond_amount: Yup.number().typeError("Giá trị phải là số").moreThan(0, "Giá trị phải lớn hơn 0").required("Số tiền là bắt buộc"),
  bond_type: Yup.string().required("Loại bảo lãnh là bắt buộc"),
  bond_number: Yup.string().required("Mã bảo lãnh là bắt buộc"),
  expiry_date: Yup.date().typeError("Ngày không hợp lệ").required("Ngày hết hạn là bắt buộc"),
  issue_date: Yup.date().typeError("Ngày không hợp lệ").required("Ngày phát hành là bắt buộc"),
});

// Bid Document
export const SchemaBidDocument = Yup.object().shape({
  implementation_time: Yup.string().required("Thời gian thực hiện là bắt buộc"),
  bid_price: Yup.number().required("Giá thầu là bắt buộc").positive("Giá thầu phải là số dương"),
  bid_bond_id: Yup.string().required("Mã bảo lãnh là bắt buộc"),
  project_id: Yup.string().required("Dự án là bắt buộc"),
  enterprise_id: Yup.string().required("Tổ chức bảo lãnh là bắt buộc"),
});

// Evaluation Criteria
export const schemaEvaluation = Yup.object().shape({
  project_id: Yup.string().trim().required("Dự án là bắt buộc"),
  description: Yup.string().trim().required("Mô tả là bắt buộc"),
  name: Yup.string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt").required("Tên tiêu chí đánh giá là bắt buộc"),
  weight: Yup.number().typeError("Phải là số").moreThan(0, "Giá trị phải lớn hơn 0").required("Trọng số đánh giá là bắt buộc"),
});

// Funding Source
export const schemaFundingSource = Yup.object().shape({
  name: Yup.string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt").required("Tên nguồn tài trợ là bắt buộc"),
  type: Yup.string().trim().required("Loại nguồn tài trợ là bắt buộc"),
  code: Yup.string().trim().required("Mã nguồn tài trợ là bắt buộc"),
  description: Yup.string().trim().required("Mô tả là bắt buộc"),
});

// Work Progresses
export const schemaWorkProgresses = Yup.object().shape({
  name: Yup.string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt").required("Tên tiến độ là bắt buộc"),
  expense: Yup.number().typeError("Phải là số").moreThan(0, "Giá trị phải lớn hơn 0").required("Chi phí là bắt buộc"),
  progress: Yup.string().trim().required("Tiến độ là bắt buộc"),
  start_date: Yup.date().required("Ngày bắt đầu là bắt buộc"),
  feedback: Yup.string().trim().required("Nhận xét là bắt buộc"),
  end_date: Yup.date().required("Ngày kết thúc là bắt buộc"),
  project_id: Yup.string().trim().required("Dự án là bắt buộc"),
  task_ids: Yup.array()
    .of(Yup.number().required("Mỗi nhiệm vụ phải là một số hợp lệ"))
    .min(1, "Ít nhất một nhiệm vụ là bắt buộc")
    .required("Nhiệm vụ là bắt buộc"),
});

// ===========> Enterprice

//Enterprice
export const getSchemaEnterprise = (type: string) => {
  const baseSchema = {
    name: Yup.string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt").required("Tên doanh nghiệp là bắt buộc"),
    address: Yup.string().trim().required("Địa chỉ là bắt buộc."),
    email: Yup.string().email("Email không hợp lệ.").required("Email là bắt buộc."),
    establish_date: Yup.date().required("Ngày thành lập là bắt buộc."),
    industry_id: Yup.array().min(1, "Vui lòng chọn ít nhất một lĩnh vực").required("Vui lòng không để trống trường này"),
    organization_type: Yup.string().required("Loại hình doanh nghiệp là bắt buộc."),
    phone: Yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ.").required("Số điện thoại là bắt buộc."),
    registration_date: Yup.date().required("Ngày đăng ký kinh doanh là bắt buộc."),
    registration_number: Yup.string().required("Số đăng ký kinh doanh là bắt buộc."),
    representative: Yup.string().required("Người đại diện là bắt buộc."),
    roles: Yup.array().min(1, "Vui lòng chọn ít nhất 1 vai trò.").required("Vai trò là bắt buộc."),
    taxcode: Yup.string().required("Mã số thuế là bắt buộc."),
    website: Yup.string().url("Website không hợp lệ.").required("Website là bắt buộc."),
  };

  if (type === "CREATE") {
    return Yup.object().shape({
      ...baseSchema,
      password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự.").required("Mật khẩu là bắt buộc."),
    });
  }

  return Yup.object().shape(baseSchema);
};

// Employees
export const schemaEmployees = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(/^[^\d]*$/, "Họ tên không được chứa số")
    .required("Họ tên là bắt buộc")
    .max(255, "Tối đa 255 ký tự"),
  code: Yup.string().trim().required("Mã nhân viên là bắt buộc").max(255, "Tối đa 255 ký tự"),
  email: Yup.string()
    .trim()
    .required("Địa chỉ email là bắt buộc")
    .email("Địa chỉ email không hợp lệ")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Định dạng email chưa đúng")
    .max(255, "Tối đa 255 ký tự"),
  phone: Yup.string().trim().required("Số điện thoại là bắt buộc").matches(phoneRegExp, "Số điện thoại không hợp lệ"),
  //   taxcode: Yup.string()
  //     .trim()
  //     .required("Mã số thuế là bắt buộc")
  //     .max(255, "Tối đa 255 ký tự"),
  gender: Yup.string().required("Giới tính là bắt buộc"),
  enterprise_id: Yup.string().required("Công ty làm việc là bắt buộc"),
  status: Yup.string().required("Trạng thái làm việc là bắt buộc"),
  education_level: Yup.string().required("Trình độ học vấn là bắt buộc"),
  start_date: Yup.string().required("Ngày bắt đầu làm việc là bắt buộc"),
});

// Task
export const schemaTask = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(/^[\p{L}0-9\s._,`-]*$/u, "Không được chứa ký tự đặc biệt")
    .required("Tên công việc là bắt buộc"),
  code: Yup.string().trim().required("Mã công việc là bắt buộc"),
  employee_id: Yup.array().min(1, "Vui lòng chọn ít nhất 1 nhân viên").required("Nhân viên là bắt buộc"),
  project_id: Yup.string().trim().required("Dự án là bắt buộc"),
  difficulty_level: Yup.string().trim().required("Mức độ làm việc là bắt buộc"),
});

// Business Activity
export const schemaBusinessActivity = Yup.object().shape({
  name: Yup.string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Tên loại hình kinh doanh là bắt buộc"),
});

// Industry

export const schemaIndustry = Yup.object().shape({
  name: Yup.string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Tên ngành kinh doanh là bắt buộc"),
  business_activity_type_id: Yup.string().trim().required("Loại hình kinh doanh là bắt buộc"),
});

// Bidding Results
export const schemaBiddingResults = Yup.object().shape({
  bid_document_id: Yup.string().required("Hồ sơ trúng thầu là bắt buộc"),
  win_amount: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Số tiền phải là một số hợp lệ")
    .required("Số tiền thắng thầu là bắt buộc"),
  decision_number: Yup.string()
    .required("Số quyết định là bắt buộc")
    .matches(
      /^[\da-zA-ZÀÁẢÃẠÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘÙÚỦŨỤÝỲỶỸỴĐđ/._-]+$/,
      "Số quyết định chỉ được chứa số, chữ cái (cả in hoa và in thường, có dấu) và các ký tự / - _ .",
    ),
  decision_date: Yup.date().nullable().required("Ngày quyết định là bắt buộc"), // Adjust if necessary
});

// Evaluates

export const schemaEvaluates = Yup.object().shape({
  // project_id: string().required("Dự án là bắt buộc"),
  // enterprise_id: string().required("Doanh nghiệp là bắt buộc"),
  score: Yup.string()
    .required("Số điểm là bắt buộc")
    .test("min-max", "Số điểm phải từ 1 đến 10", (value) => {
      const num = Number(value);
      return num >= 1 && num <= 10;
    }),
  title: Yup.string().required("Tiêu đề là bắt buộc"),
  evaluate: Yup.string().required("Nội dung là bắt buộc"),
});

//Selection Methods
export const schemaSelectMethod = Yup.object().shape({
  method_name: Yup.string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Hình thức đấu thầu là bắt buộc"),
});
