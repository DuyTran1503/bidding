import FormDate from "@/components/form/FormDate";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IFundingSource } from "@/services/store/funding_source/funding_source.model";
import { getListFundingSource } from "@/services/store/funding_source/funding_source.thunk";
import { INewProject } from "@/services/store/project/project.model";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { ISelectionMethodInitialState, selectionMethodSlice } from "@/services/store/selectionMethod/selectionMethod.slice";
import { getListSelectionMethods } from "@/services/store/selectionMethod/selectionMethod.thunk";
import { EPageTypes } from "@/shared/enums/page";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, Input, Row } from "antd";
import { Form, Formik, FormikHelpers } from "formik";
import { SetStateAction, useEffect, useState } from "react";
import { array, date, number, object, string } from "yup";
import dayjs from "dayjs";
import lodash, { values } from "lodash";
import { STATUS_PROJECT, STATUS_PROJECT_ARRAY, STATUS_PROJECT_LABELS } from "@/shared/enums/statusProject";
import FormSelect from "@/components/form/FormSelect";
import FormCkEditor from "@/components/form/FormCkEditor";
import { SUBMIT_METHOD } from "@/shared/enums/submissionMethod";
import { convertEnum } from "@/shared/utils/common/convertEnum";
import { IIndustryInitialState } from "@/services/store/industry/industry.slice";
import { getIndustries } from "@/services/store/industry/industry.thunk";
import { convertDataOptions } from "./helper";
import { IFundingSourceInitialState } from "@/services/store/funding_source/funding_source.slice";
import Button from "@/components/common/Button";
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import SelectionMethodForm from "../SelectionMethods/SelectionMethodForm";
import AttachmentForm from "../Attachment/ActionModule";
import { EButtonTypes } from "@/shared/enums/button";
import clsx from "clsx";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { createProject } from "@/services/store/project/project.thunk";
import { IAccountInitialState } from "@/services/store/account/account.slice";
import { getListStaff } from "@/services/store/account/account.thunk";
import { IProcurementInitialState } from "@/services/store/procurement/procurement.slice";
import { getListProcurement } from "@/services/store/procurement/procurement.thunk";
import { DOMESTIC, domesticEnumArray, mappingDOMESTIC } from "@/shared/enums/domestic";
import useFetchStatus from "@/hooks/useFetchStatus";
interface IPropProject {
  formikRef?: FormikRefType<INewProject>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW | EPageTypes.APPROVE;
  project?: INewProject;
}

const ActionModule = ({ formikRef, type, project }: IPropProject) => {
  const { dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateIndustry, dispatch: dispatchIndustry } = useArchive<IIndustryInitialState>("industry");
  const { state: stateFundingSource, dispatch: dispatchFundingSource } = useArchive<IFundingSourceInitialState>("funding_source");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: stateMethod, dispatch: dispatchMethod } = useArchive<ISelectionMethodInitialState>("selection_method");
  const { state: stateStaff, dispatch: dispatchStaff } = useArchive<IAccountInitialState>("account");
  const { state: stateProcurement, dispatch: dispatchProcurement } = useArchive<IProcurementInitialState>("procurement");
  const initialValues: INewProject = {
    id: project ? project.id : 0,
    parent_id: project ? project.parent_id : null,
    children: project ? project.children : [],
    name: project ? project.name : "",
    selection_method_id: project ? project.selection_method_id : undefined,
    location: project ? project.location : "",
    tenderer_id: project?.tenderer_id || [],
    investor_id: project?.investor_id || [],
    funding_source_id: project?.funding_source_id || undefined,
    staff_id: project?.staff_id || undefined,
    industry_id: project?.industry_id || [],
    is_domestic: project?.is_domestic || DOMESTIC.INSIDE,
    amount: project?.amount || 0,
    total_amount: project?.total_amount || 0,
    receiving_place: project?.receiving_place || "",
    bid_submission_start: project?.bid_submission_start || "",
    bid_submission_end: project?.bid_submission_end || "",
    bid_opening_date: project?.bid_opening_date || "",
    start_time: project?.start_time || "",
    end_time: project?.end_time || "",
    approve_at: project?.approve_at || "",
    decision_number_approve: project?.decision_number_approve || "",
    description: project?.description || "",
    status: project?.status || STATUS_PROJECT.AWAITING,
    procurement_id: project?.procurement_id || [],
    submission_method: project?.submission_method || SUBMIT_METHOD.online,
    files: project?.files || [],
    decision_number_issued: project?.decision_number_issued || "",
  };
  const stringRegex = /^[\p{L}0-9\s._`-]*$/u;
  const Schema = object().shape({
    parent_id: number().nullable(),
    name: string().trim().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    bidding_field_id: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    staff_id: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng không để trống trường này"),
    selection_method_id: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng không để trống trường này"),
    release_date: date().required("Vui lòng không để trống trường này"),
    decision_issuance: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    owner_representative: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    tenderer_representative: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    location: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    funding_source_id: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    tender_package_price: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng không để trống trường này"),
    description: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    submission_deadline: date().required("Vui lòng không để trống trường này"),
    invest_total: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng không để trống trường này"),
    tender_date: date().required("Vui lòng không để trống trường này"),
    enterprise_id: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    technical_requirements: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    attached_documents: array().min(1, "Vui lòng chọn ít nhất một tài liệu đính kèm"),
    end_bidding: date().required("Vui lòng không để trống trường này"),
    start_bidding: date().required("Vui lòng không để trống trường này"),
    location_bidding: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
    start_time: date().required("Vui lòng không để trống trường này"),
    end_time: date().required("Vui lòng không để trống trường này"),
    status: string().matches(stringRegex, "Không được chứa ký tự đặc biệt ").required("Vui lòng không để trống trường này"),
  });

  useEffect(() => {
    dispatchMethod(getListSelectionMethods());
    dispatchFundingSource(getListFundingSource());
    dispatchEnterprise(getListEnterprise());
    dispatchIndustry(getIndustries());
    dispatchStaff(getListStaff());
    dispatchProcurement(getListProcurement());
  }, []);
  const optionDomestic = domesticEnumArray.map((item) => ({
    value: item,
    label: mappingDOMESTIC[item],
  }));

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const data = {
            ...lodash.omit(values, "id", "children"),
          };
          if (type === EPageTypes.CREATE) {
            console.log("dfgdfg", data);
            return dispatchProject(createProject(data as Omit<INewProject, "id">));
          }
          if (type === EPageTypes.APPROVE) {
          }
        }}
        enableReinitialize
        // validationSchema={Schema}
        innerRef={formikRef}
      >
        {({ values, errors, touched, handleBlur, setFieldValue }) => {
          return (
            <Form>
              <Row gutter={[24, 12]}>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Tên Dự Án">
                    <FormInput
                      label="Tên Dự Án"
                      placeholder="Nhập tên dự án..."
                      name="name"
                      value={values.name}
                      error={touched.name ? errors.name : ""}
                      onChange={(e) => setFieldValue("name", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Hình thức lựa chọn nhà thầu">
                    <FormSelect
                      label="Hình thức lựa chọn nhà thầu "
                      placeholder="Chọn phương thức..."
                      id="selection_method_id"
                      value={values.selection_method_id as string}
                      error={touched.selection_method_id ? errors.selection_method_id : ""}
                      onChange={(e) => setFieldValue("selection_method_id", e)}
                      options={convertDataOptions((stateMethod?.listSelectionMethods as any) || [])}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Hình thức tham gia đấu thầu">
                    <FormSelect
                      label="Hình thức tham gia đấu thầu "
                      placeholder="Chọn hình thức..."
                      id=""
                      value={values.submission_method as string}
                      error={touched.submission_method ? errors.submission_method : ""}
                      onChange={(e) => setFieldValue("submission_method", e)}
                      options={convertEnum(SUBMIT_METHOD)}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Địa Điểm">
                    <FormInput
                      label="Địa Điểm"
                      placeholder="Nhập địa điểm..."
                      name="location"
                      value={values.location}
                      error={touched.location ? errors.location : ""}
                      onChange={(e) => setFieldValue("location", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title=" Bên Mời Thầu">
                    <FormSelect
                      label=" Bên Mời Thầu"
                      placeholder="Nhập  bên mời thầu..."
                      id="tenderer_id"
                      value={values.tenderer_id}
                      onChange={(e) => setFieldValue("tenderer_id", e)}
                      options={convertDataOptions(stateEnterprise.listEnterprise || [])}
                    />
                  </FormGroup>
                </Col>

                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title=" Chủ đầu tư">
                    <FormSelect
                      label=" Chủ đầu tư"
                      placeholder="Nhập  chủ đầu tư..."
                      id="investor_id"
                      value={values.investor_id}
                      options={convertDataOptions(stateEnterprise.listEnterprise || [])}
                      onChange={(e) => setFieldValue("investor_id", e)}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Nguồn Vốn">
                    <FormSelect
                      label="Nguồn Vốn "
                      placeholder="Nhập nguồn vốn..."
                      id="funding_source_id"
                      value={values.funding_source_id as string}
                      error={touched.funding_source_id ? errors.funding_source_id : ""}
                      onChange={(e) => setFieldValue("funding_source_id", e)}
                      options={convertDataOptions(stateFundingSource.listFundingSources || [])}
                    />
                  </FormGroup>
                </Col>

                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Người phê duyệt">
                    <FormSelect
                      label="Người phê duyệt"
                      placeholder="Chọn người phê duyệt..."
                      id="staff_id"
                      value={values.staff_id as string}
                      error={touched.staff_id ? errors.staff_id : ""}
                      options={convertDataOptions(stateStaff?.getListStaff)}
                      onChange={(e) => setFieldValue("staff_id", e)}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title=" Dịch vụ mua sắm đầu thầu công">
                    <FormSelect
                      isMultiple
                      label=" Dịch vụ mua sắm đầu thầu công"
                      placeholder="Chọn..."
                      id="procurement_id"
                      value={values.procurement_id}
                      onChange={(e) => setFieldValue("procurement_id", e)}
                      options={convertDataOptions(stateProcurement?.listProcurement || [])}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title=" Ngành Nghề">
                    <FormSelect
                      isMultiple
                      label=" Ngành Nghề"
                      placeholder="Nhập  ngành nghề..."
                      id="industry_id"
                      value={values.industry_id}
                      onChange={(e) => setFieldValue("industry_id", e)}
                      options={convertDataOptions(stateIndustry?.listIndustry || [])}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Số quyết định ban hành">
                    <FormInput
                      label="Số quyết định ban hành"
                      placeholder="Nhập số quyết định ban hành..."
                      name="decision_number_issued"
                      value={values.decision_number_issued}
                      error={touched.decision_number_issued ? errors.decision_number_issued : ""}
                      onChange={(e) => setFieldValue("decision_number_issued", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Quốc Tế">
                    <FormSelect
                      label="Quốc Tế "
                      placeholder="Nhập thông tin..."
                      id="is_domestic"
                      value={values.is_domestic as unknown as string}
                      options={optionDomestic}
                      error={touched.is_domestic ? errors.is_domestic : ""}
                      onChange={(e) => setFieldValue("is_domestic", e)}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Số Tiền">
                    <FormInput
                      label="Số Tiền"
                      placeholder="Nhập số tiền..."
                      name="amount"
                      value={values.amount}
                      error={touched.amount ? errors.amount : ""}
                      onChange={(e) => setFieldValue("amount", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Tổng đầu tư">
                    <FormInput
                      label="Số Tiền"
                      placeholder="Nhập số tiền..."
                      name="total_amount"
                      value={values.total_amount}
                      error={touched.total_amount ? errors.total_amount : ""}
                      onChange={(e) => setFieldValue("total_amount", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>

                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Địa Điểm Nhận Hồ Sơ">
                    <FormInput
                      label="Địa Điểm Nhận Hồ Sơ"
                      placeholder="Nhập địa điểm nhận hồ sơ..."
                      name="receiving_place"
                      value={values.receiving_place}
                      error={touched.receiving_place ? errors.receiving_place : ""}
                      onChange={(e) => setFieldValue("receiving_place", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Thời Gian Nộp Hồ Sơ">
                    <FormDate
                      disabled={type === EPageTypes.VIEW}
                      label="Ngày bắt đầu nộp hồ sơ"
                      value={values.bid_submission_start ? dayjs(values.bid_submission_start) : null}
                      onChange={(date) => setFieldValue("bid_submission_start", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>

                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Ngày kết thúc nộp hồ sơ">
                    <FormDate
                      disabled={type === EPageTypes.VIEW}
                      label="Ngày kết thúc nộp hồ sơ"
                      minDate={values.bid_submission_start ? dayjs(values.bid_submission_start) : undefined}
                      value={values.bid_submission_end ? dayjs(values.bid_submission_end) : null}
                      onChange={(date) => setFieldValue("bid_submission_end", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Ngày Mở Thầu">
                    <FormDate
                      disabled={type === EPageTypes.VIEW}
                      label="Ngày mở thầu"
                      minDate={values.bid_submission_end ? dayjs(values.bid_submission_end) : undefined}
                      value={values.bid_opening_date ? dayjs(values.bid_opening_date) : null}
                      onChange={(date) => setFieldValue("bid_opening_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>

                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Ngày bắt đầu đấu thầu">
                    <FormDate
                      disabled={type === EPageTypes.VIEW}
                      label="Ngày bắt đầu đấu thầu"
                      minDate={values.bid_submission_end ? dayjs(values.bid_submission_end) : undefined}
                      value={values.start_time ? dayjs(values.start_time) : null}
                      onChange={(date) => setFieldValue("start_time", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Ngày kết thúc đấu thầu">
                    <FormDate
                      disabled={type === EPageTypes.VIEW}
                      label="Ngày kết thúc đấu thầu"
                      minDate={values.start_time ? dayjs(values.bid_submission_end) : undefined}
                      value={values.end_time ? dayjs(values.end_time) : null}
                      onChange={(date) => setFieldValue(".end_time", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
                {type === EPageTypes.APPROVE && (
                  <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                    <FormGroup title="Ngày phê duyệt">
                      <FormDate
                        disabled
                        label="Ngày phê duyệt"
                        value={values.approve_at ? dayjs(values.approve_at) : dayjs()}
                        onChange={(date) => setFieldValue("approve_at", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                      />
                    </FormGroup>
                  </Col>
                )}

                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Trạng thái dự án">
                    <FormSelect
                      options={STATUS_PROJECT_ARRAY}
                      label="Trạng thái dự án"
                      id="status"
                      // isDisabled
                      value={values.status as unknown as string}
                      error={touched.status ? errors.status : ""}
                      onChange={(e) => setFieldValue("status", e)}
                    />
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                  <FormGroup title="Tài liệu đính kèm">
                    <FormUploadFile isMultiple value={values.files} onChange={(e) => setFieldValue("files", e)}></FormUploadFile>
                  </FormGroup>
                </Col>
                <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                  <FormGroup title="Mô Tả">
                    <FormCkEditor label="Mô tả" id="description" value={values.description ?? ""} onChange={(e) => setFieldValue("description", e)} />
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
