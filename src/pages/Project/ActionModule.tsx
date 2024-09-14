import FormDate from "@/components/form/FormDate";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { IBiddingFieldInitialState } from "@/services/store/biddingField/biddingField.slice";
import { getBiddingFieldAllIds } from "@/services/store/biddingField/biddingField.thunk";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IFundingSource } from "@/services/store/funding_source/funding_source.model";
import { getListFundingSource } from "@/services/store/funding_source/funding_source.thunk";
import { IProject } from "@/services/store/project/project.model";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { ISelectionMethodInitialState } from "@/services/store/selectionMethod/selectionMethod.slice";
import { getListSelectionMethods } from "@/services/store/selectionMethod/selectionMethod.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, Form, Row } from "antd";
import { Formik, FormikHelpers } from "formik";
import { useEffect } from "react";
import { array, date, number, object, string } from "yup";
import dayjs from "dayjs";
import lodash from "lodash";
import { STATUS_PROJECT, STATUS_PROJECT_LABELS } from "@/shared/enums/statusProject";
interface IPropProject {
  formikRef?: FormikRefType<IProject>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  project?: IProject;
}

const ActionModule = ({ formikRef, type, project }: IPropProject) => {
  const { dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateBiddingField, dispatch: dispatchBiddingField } = useArchive<IBiddingFieldInitialState>("bidding_field");
  const { state: stateFundingSource, dispatch: dispatchFundingSource } = useArchive<IFundingSource>("funding_source");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: stateMethod, dispatch: dispatchMethod } = useArchive<ISelectionMethodInitialState>("selection_method");

  const initialValues: IProject = {
    id: project?.id || "",
    parent_id: project?.parent_id || undefined,
    children: project?.children || null,
    name: project?.name || "",
    bidding_field_id: project?.bidding_field_id || "",
    staff_id: project?.staff_id || undefined,
    selection_method_id: project?.selection_method_id || undefined,
    release_date: project?.release_date || "",
    decision_issuance: project?.decision_issuance || "",
    owner_representative: project?.owner_representative || "",
    tenderer_representative: project?.tenderer_representative || "",
    location: project?.location || "",
    funding_source_id: project?.funding_source_id || "",
    tender_package_price: project?.tender_package_price || 0,
    description: project?.description || "",
    submission_deadline: project?.submission_deadline || "",
    invest_total: project?.invest_total || 0,
    tender_date: project?.tender_date || "",
    enterprise_id: project?.enterprise_id || "",
    technical_requirements: project?.technical_requirements || "",
    attached_documents: project?.attached_documents || undefined,
    end_bidding: project?.end_bidding || undefined,
    start_bidding: project?.start_bidding || undefined,
    location_bidding: project?.location_bidding || undefined,
    start_time: project?.start_time || undefined,
    end_time: project?.end_time || undefined,
    status: project?.status || STATUS_PROJECT.AWAITING,
  };
  const stringRegex = /^[a-zA-Z0-9._-]*$/;
  const Schema = object().shape({
    parent_id: number().nullable(),
    name: string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-").required("Vui lòng không để trống trường này"),
    bidding_field_id: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-").required("Vui lòng không để trống trường này"),
    staff_id: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng không để trống trường này"),
    selection_method_id: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng không để trống trường này"),
    release_date: date().required("Vui lòng không để trống trường này"),
    decision_issuance: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-").required("Vui lòng không để trống trường này"),
    owner_representative: string()
      .matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-")
      .required("Vui lòng không để trống trường này"),
    tenderer_representative: string()
      .matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-")
      .required("Vui lòng không để trống trường này"),
    location: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-").required("Vui lòng không để trống trường này"),
    funding_source_id: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-").required("Vui lòng không để trống trường này"),
    tender_package_price: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng không để trống trường này"),
    description: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-").required("Vui lòng không để trống trường này"),
    submission_deadline: date().required("Vui lòng không để trống trường này"),
    invest_total: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng không để trống trường này"),
    tender_date: date().required("Vui lòng không để trống trường này"),
    enterprise_id: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-").required("Vui lòng không để trống trường này"),
    technical_requirements: string()
      .matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-")
      .required("Vui lòng không để trống trường này"),
    attached_documents: array().min(1, "Vui lòng chọn ít nhất một tài liệu đính kèm"),
    end_bidding: date().required("Vui lòng không để trống trường này"),
    start_bidding: date().required("Vui lòng không để trống trường này"),
    location_bidding: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-").required("Vui lòng không để trống trường này"),
    start_time: date().required("Vui lòng không để trống trường này"),
    end_time: date().required("Vui lòng không để trống trường này"),
    status: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ngoại trừ ._-").required("Vui lòng không để trống trường này"),
  });
  useEffect(() => {
    dispatchMethod(getListFundingSource());
    dispatchFundingSource(getListSelectionMethods());
    dispatchEnterprise(getListEnterprise());
    dispatchBiddingField(getBiddingFieldAllIds());
  }, []);

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const data = {
            ...lodash.omit(values, "id", "children"),
          };
        }}
        enableReinitialize
        validationSchema={Schema}
        innerRef={formikRef}
      >
        {({ values, errors, touched, handleBlur, setFieldValue }) => {
          return (
            <Form>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Tên dự án">
                    <FormInput
                      label="Tên dự án"
                      placeholder="Tên loại hình dự án..."
                      name="name"
                      value={values.name}
                      error={touched.name ? errors.name : ""}
                      onChange={(e) => setFieldValue("name", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Người đại diện">
                    <FormInput
                      label="Người đại diện"
                      placeholder="Nhập đại diện..."
                      name="owner_representative"
                      value={values.owner_representative}
                      error={touched.owner_representative ? errors.owner_representative : ""}
                      onChange={(e) => setFieldValue("owner_representative", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* New Row 1 */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Lĩnh vực thầu">
                    <FormInput
                      label="Bidding Field ID"
                      placeholder="Nhập ID lĩnh vực thầu..."
                      name="bidding_field_id"
                      value={values.bidding_field_id}
                      error={touched.bidding_field_id ? errors.bidding_field_id : ""}
                      onChange={(e) => setFieldValue("bidding_field_id", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Người đại diện thầu">
                    <FormInput
                      label="Tenderer Representative"
                      placeholder="Nhập đại diện thầu..."
                      name="tenderer_representative"
                      value={values.tenderer_representative}
                      error={touched.tenderer_representative ? errors.tenderer_representative : ""}
                      onChange={(e) => setFieldValue("tenderer_representative", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* New Row 2 */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Ngày phát hành">
                    <FormDate
                      disabled={type === EPageTypes.VIEW}
                      label="Ngày phát hành"
                      value={values.release_date ? dayjs(values.release_date) : null}
                      onChange={(date) => setFieldValue("release_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Nguồn vốn">
                    <FormInput
                      label="Funding Source"
                      placeholder="Nhập nguồn vốn..."
                      name="funding_source_id"
                      value={values.funding_source_id}
                      error={touched.funding_source_id ? errors.funding_source_id : ""}
                      onChange={(e) => setFieldValue("funding_source_id", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* New Row 3 */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Giá gói thầu">
                    <FormInput
                      label="Tender Package Price"
                      placeholder="Nhập giá gói thầu..."
                      name="tender_package_price"
                      value={values.tender_package_price}
                      error={touched.tender_package_price ? errors.tender_package_price : ""}
                      onChange={(e) => setFieldValue("tender_package_price", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Tổng đầu tư">
                    <FormInput
                      label="Invest Total"
                      placeholder="Nhập tổng đầu tư..."
                      name="invest_total"
                      value={values.invest_total}
                      error={touched.invest_total ? errors.invest_total : ""}
                      onChange={(e) => setFieldValue("invest_total", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* New Row 4 */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Mô tả">
                    <FormInput
                      label="Description"
                      placeholder="Nhập mô tả..."
                      name="description"
                      value={values.description}
                      error={touched.description ? errors.description : ""}
                      onChange={(e) => setFieldValue("description", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Ngày nộp hồ sơ">
                    <FormDate
                      disabled={type === EPageTypes.VIEW}
                      label="Ngày nộp hồ sơ"
                      value={values.submission_deadline ? dayjs(values.submission_deadline) : null}
                      onChange={(date) => setFieldValue("submission_deadline", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* New Row 5 */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Ngày thầu">
                    <FormDate
                      disabled={type === EPageTypes.VIEW}
                      label="Tender Date"
                      value={values.tender_date ? dayjs(values.tender_date) : null}
                      onChange={(date) => setFieldValue("tender_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="ID doanh nghiệp">
                    <FormInput
                      label="Enterprise ID"
                      placeholder="Nhập ID doanh nghiệp..."
                      name="enterprise_id"
                      value={values.enterprise_id}
                      error={touched.enterprise_id ? errors.enterprise_id : ""}
                      onChange={(e) => setFieldValue("enterprise_id", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* New Row 6 */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Tiêu chuẩn kỹ thuật">
                    <FormInput
                      label="Technical Requirements"
                      placeholder="Nhập tiêu chuẩn kỹ thuật..."
                      name="technical_requirements"
                      value={values.technical_requirements}
                      error={touched.technical_requirements ? errors.technical_requirements : ""}
                      onChange={(e) => setFieldValue("technical_requirements", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Tài liệu đính kèm">
                    <FormInput
                      label="Attached Documents"
                      placeholder="Nhập tài liệu đính kèm..."
                      name="attached_documents"
                      value={values.attached_documents || ""}
                      error={touched.attached_documents ? errors.attached_documents : ""}
                      onChange={(e) => setFieldValue("attached_documents", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* New Row 7 */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Ngày bắt đầu thầu">
                    <FormDate
                      disabled={type === EPageTypes.VIEW}
                      label="Start Bidding"
                      value={values.start_bidding ? dayjs(values.start_bidding) : null}
                      onChange={(date) => setFieldValue("start_bidding", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Ngày kết thúc thầu">
                    <FormDate
                      disabled={type === EPageTypes.VIEW}
                      label="End Bidding"
                      value={values.end_bidding ? dayjs(values.end_bidding) : null}
                      onChange={(date) => setFieldValue("end_bidding", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* New Row 8 */}
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Vị trí thầu">
                    <FormInput
                      label="Location Bidding"
                      placeholder="Nhập vị trí thầu..."
                      name="location_bidding"
                      value={values.location_bidding || ""}
                      error={touched.location_bidding ? errors.location_bidding : ""}
                      onChange={(e) => setFieldValue("location_bidding", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Trạng thái">
                    <FormInput
                      label="Status"
                      placeholder="Nhập trạng thái..."
                      name="status"
                      isDisabled
                      value={
                        values.status !== undefined && !isNaN(Number(values.status))
                          ? STATUS_PROJECT_LABELS[Number(values.status) as STATUS_PROJECT]
                          : ""
                      }
                      error={touched.status ? errors.status : ""}
                      onChange={(e) => setFieldValue("status", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
export default ActionModule;
