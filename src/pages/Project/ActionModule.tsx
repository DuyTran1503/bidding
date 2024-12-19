import FormDate from "@/components/form/FormDate";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { INewProject } from "@/services/store/project/project.model";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { EPageTypes } from "@/shared/enums/page";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, Row } from "antd";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { array, date, number, object, string } from "yup";
import dayjs from "dayjs";
import { STATUS_PROJECT, STATUS_PROJECT_ARRAY } from "@/shared/enums/statusProject";
import FormSelect from "@/components/form/FormSelect";
import FormCkEditor from "@/components/form/FormCkEditor";
import { SUBMIT_METHOD } from "@/shared/enums/submissionMethod";
import { convertEnum } from "@/shared/utils/common/convertEnum";
import { convertDataOptions } from "./helper";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { createProject, updateProject } from "@/services/store/project/project.thunk";
import { DOMESTIC, domesticEnumArray, mappingDOMESTIC } from "@/shared/enums/domestic";
import lodash from "lodash";
import ProjectCard from "./ChildrenProject/ProjectCard";
import { IIndustry } from "@/services/store/industry/industry.model";
import { ISelectionMethod } from "@/services/store/selectionMethod/selectionMethod.model";
import { IFundingSource } from "@/services/store/funding_source/funding_source.model";
import { IStaff } from "@/services/store/account/account.model";
import { IEnterprise } from "@/services/store/enterprise/enterprise.model";
import { IProcurement } from "@/services/store/procurement/procurement.model";
import { convertToFiles } from "@/components/form/FormUpload/FormUploadImage";
import FormNumber from "@/components/form/FormNumber";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { schemaProject } from "@/shared/Schema/schema";
interface IPropProject {
  formikRef?: FormikRefType<INewProject>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW | EPageTypes.APPROVE;
  project?: INewProject;
  isChildren?: boolean;
  setActiveTabKey?: (key: string) => void;
  onChildSelect?: (child: INewProject) => void;
  listIndustry?: IIndustry[];
  listSelectionMethods?: ISelectionMethod[];
  listFundingSources?: IFundingSource[];
  getListStaff?: IStaff[];
  listEnterprise?: IEnterprise[];
  listProcurement?: IProcurement[];
  item?: INewProject;
  parent_id?: number;
  activeTabKey?: string
}
type FileObject = {
  path: string;
  [key: string]: any; // Chấp nhận các thuộc tính khác
};
const ActionModule = ({
  formikRef,
  type,
  project,
  item,
  isChildren,
  setActiveTabKey,
  onChildSelect,
  listIndustry,
  listSelectionMethods,
  listFundingSources,
  getListStaff,
  listEnterprise,
  listProcurement,
  parent_id,
  activeTabKey
}: IPropProject) => {
  const { dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const [children, setChildren] = useState<INewProject[]>([]);

  const initialValues: INewProject = useMemo(
    () => ({
      id: isChildren && type === EPageTypes.CREATE ? 0 : item && isChildren && type === EPageTypes.UPDATE ? item.id : project?.id ?? 0,

      parent_id:
        isChildren && type === EPageTypes.CREATE
          ? null
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.parent_id
            : project?.parent_id ?? null,

      children: children ?? [],

      name: isChildren && type === EPageTypes.CREATE ? "" : item && isChildren && type === EPageTypes.UPDATE ? item.name : project?.name ?? "",

      selection_method_id:
        isChildren && type === EPageTypes.CREATE
          ? undefined
          : item && isChildren && type === EPageTypes.UPDATE
            ? item?.selection_method?.id
            : project?.selection_method ?? undefined,

      location:
        isChildren && type === EPageTypes.CREATE ? "" : item && isChildren && type === EPageTypes.UPDATE ? item.location : project?.location ?? "",

      tenderer_id:
        isChildren && type === EPageTypes.CREATE
          ? null
          : item && isChildren && type === EPageTypes.UPDATE
            ? +item.tenderer.id! || null
            : +project?.tenderer! || null,

      investor_id:
        isChildren && type === EPageTypes.CREATE
          ? null
          : item && isChildren && type === EPageTypes.UPDATE
            ? +item.investor.id! || null
            : +project?.investor! || null,

      funding_source_id:
        isChildren && type === EPageTypes.CREATE
          ? undefined
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.funding_source.id
            : project?.funding_source ?? undefined,

      staff_id:
        isChildren && type === EPageTypes.CREATE
          ? undefined
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.staff.id
            : project?.staff ?? undefined,

      industry_id:
        isChildren && type === EPageTypes.CREATE
          ? []
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.industry_id?.map((item: any) => item.id)
            : project?.industry_id ?? [],

      is_domestic:
        isChildren && type === EPageTypes.CREATE
          ? DOMESTIC.INSIDE
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.is_domestic
            : project?.is_domestic ?? DOMESTIC.INSIDE,

      amount: (() => {
        if (isChildren) {
          if (type === EPageTypes.CREATE) {
            return undefined;
          } else if (type === EPageTypes.UPDATE) {
            return item?.amount !== undefined ? parseFloat(item.amount as unknown as string) : undefined;
          }
        }
        return project?.amount !== undefined ? parseFloat(project.amount as any) : undefined;
      })(),

      total_amount: (() => {
        if (isChildren) {
          if (type === EPageTypes.CREATE) {
            return undefined;
          } else if (type === EPageTypes.UPDATE) {
            return item?.total_amount !== undefined ? parseFloat(item.total_amount as unknown as string) : undefined;
          }
        }
        return project?.total_amount !== undefined ? parseFloat(project.total_amount as any) : undefined;
      })(),
      receiving_place:
        isChildren && type === EPageTypes.CREATE
          ? ""
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.receiving_place
            : project?.receiving_place ?? "",

      bid_submission_start:
        isChildren && type === EPageTypes.CREATE
          ? ""
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.bid_submission_start
            : project?.bid_submission_start ?? "",

      bid_submission_end:
        isChildren && type === EPageTypes.CREATE
          ? ""
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.bid_submission_end
            : project?.bid_submission_end ?? "",

      bid_opening_date:
        isChildren && type === EPageTypes.CREATE
          ? ""
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.bid_opening_date
            : project?.bid_opening_date ?? "",

      start_time:
        isChildren && type === EPageTypes.CREATE
          ? ""
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.start_time
            : project?.start_time ?? "",

      end_time:
        isChildren && type === EPageTypes.CREATE ? "" : item && isChildren && type === EPageTypes.UPDATE ? item.end_time : project?.end_time ?? "",

      approve_at:
        isChildren && type === EPageTypes.CREATE
          ? ""
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.approve_at
            : project?.approve_at ?? "",

      decision_number_approve:
        isChildren && type === EPageTypes.CREATE
          ? ""
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.decision_number_approve
            : project?.decision_number_approve ?? "",

      description:
        isChildren && type === EPageTypes.CREATE
          ? ""
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.description
            : project?.description ?? "",

      status: project?.status ?? STATUS_PROJECT.AWAITING,

      procurement_id:
        isChildren && type === EPageTypes.CREATE
          ? []
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.procurement_categories?.map((item: any) => item.id)
            : project?.procurement_categories ?? [],

      submission_method: project?.submission_method ?? undefined,

      files:
        isChildren && type === EPageTypes.CREATE
          ? []
          : item && isChildren && type === EPageTypes.UPDATE && activeTabKey && +activeTabKey === 2
            ? item.attachments
            : project?.attachments ?? [],

      decision_number_issued:
        isChildren && type === EPageTypes.CREATE
          ? ""
          : item && isChildren && type === EPageTypes.UPDATE
            ? item.decision_number_issued
            : project?.decision_number_issued ?? "",

      fileChildren: undefined,
    }),
    [project],
  );


  const optionDomestic = domesticEnumArray.map((item) => ({
    value: item,
    label: mappingDOMESTIC[item],
  }));
  const mergeFiles = (projectFiles: FileObject[], dataFiles: FileObject[]): FileObject[] => {
    const dataPaths = new Set(dataFiles.map((file) => file.path));
    const filteredProjectFiles = projectFiles.filter((file) => !dataPaths.has(file.path));
    const newFiles = dataFiles.filter((file) => !projectFiles.some((pFile) => pFile.path === file.path));
    return [...filteredProjectFiles, ...newFiles];
  };
  const handleEditChild = (child: INewProject) => {
    onChildSelect && onChildSelect(child);
    setActiveTabKey && setActiveTabKey("2");
    
  };
  const handleSaveChild = (values: INewProject) => {
    const data = {
      ...lodash.omit(values, "children"),
      files: values.fileChildren,
      parent_id: item && type === EPageTypes.UPDATE ? parent_id : project?.id,
    };
    const sanitizedProject = {
      ...lodash.omit(project, ["files", "attachments", "funding_source", "industries", "procurement_categories", "investor", "tenderer"]),
      funding_source_id: project?.funding_source || undefined,
      industry_id: project?.industry_id || [],
      procurement_id: project?.procurement_categories || [],
      investor_id: project?.investor || undefined,
      tenderer_id: project?.tenderer || undefined,
    };
    const updatedFiles = initialValues.files?.length && data.files?.length ? mergeFiles(initialValues?.files as any, data.files as any) : data.files;
    const newData = updatedFiles?.length ? { ...data, files: updatedFiles } : (({ ...rest }) => rest)(data);
    const newChild = {
      ...sanitizedProject,
      children: [newData],
    };

    if (type === EPageTypes.UPDATE && item && activeTabKey && +activeTabKey === 2) {

      // return dispatchProject(updateProject({ body: newChild, param: String(parent_id) }));

    } else {
      return dispatchProject(createProject(data as Omit<INewProject, "id">));
    }
  };
  useEffect(() => {
    if (project?.children) {
      setChildren(project.children);
    }
  }, [project?.children]);
  return (
    <Formik
      validationSchema={schemaProject}
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => {

        const data = {
          ...lodash.omit(values, "id", "children", "fileChildren"),
        };
      console.log('sdf');
      
        
        if (isChildren && activeTabKey && +activeTabKey === 2) {

          handleSaveChild(values); // Sử dụng lại `handleSaveChild`
          return;
        }

        if (type === EPageTypes.CREATE) {
          return dispatchProject(createProject(data as Omit<INewProject, "id">));
        }
        if (type === EPageTypes.APPROVE) {
          return;
        }
        if (type === EPageTypes.UPDATE && project?.id && activeTabKey && +activeTabKey === 1) {
          const updatedFiles =
            initialValues.files?.length && data.files?.length ? mergeFiles(initialValues?.files as any, data.files as any) : data.files;
          const newData = convertToFiles(data.files as any)?.length ? { ...data, files: convertToFiles(data.files as any) } : (({ ...rest }) => rest)(data);
          dispatchProject(updateProject({ body: newData, param: String(project.id) }));

        }
      }}
      innerRef={formikRef}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        console.log(errors);
        
        return (
          <Form className="mt-4">
            {!isChildren && children && children.length > 0 && <ProjectCard children={children} onEdit={handleEditChild} />}
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Tên Dự Án">
                  <FormInput
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Nhập tên dự án..."
                    name="name"
                    value={values.name}
                    error={touched.name || !values.name ? errors.name : ""}
                    onChange={(e) => setFieldValue("name", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Hình thức lựa chọn nhà thầu">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn phương thức..."
                    id="selection_method_id"
                    value={values.selection_method_id as string}
                    // error={touched.selection_method_id || !values.selection_method_id ? errors.selection_method_id : ""}
                    onChange={(e) => setFieldValue("selection_method_id", e)}
                    options={convertDataOptions((listSelectionMethods as any) || [])}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Hình thức tham gia đấu thầu">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn hình thức..."
                    id="submission_method"
                    value={values.submission_method as string}
                    error={touched.submission_method || !values.selection_method ? errors.submission_method : ""}
                    onChange={(e) => {
                      setFieldValue("submission_method", e);
                      // Nếu là online, xóa giá trị Địa Điểm Nhận Hồ Sơ
                      if (e === SUBMIT_METHOD.online) {
                        setFieldValue("receiving_place", "");
                      }
                    }}
                    options={convertEnum(SUBMIT_METHOD, true)}
                  />
                </FormGroup>
              </Col>

              {/* Chỉ hiện Địa Điểm Nhận Hồ Sơ khi submission_method không phải là online */}
              {values.submission_method !== SUBMIT_METHOD.online && (
                <Col xs={24} sm={24} md={12} xl={8}>
                  <FormGroup title="Địa Điểm Nhận Hồ Sơ">
                    <FormInput
                      isDisabled={type === EPageTypes.VIEW}
                      placeholder="Nhập địa điểm nhận hồ sơ..."
                      name="receiving_place"
                      value={values.receiving_place}
                      // error={touched.receiving_place || !values.receiving_place ? errors.receiving_place : ""}
                      onChange={(e) => setFieldValue("receiving_place", e)}
                      onBlur={handleBlur}
                    />
                  </FormGroup>
                </Col>
              )}
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Địa Điểm">
                  <FormInput
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Nhập địa điểm..."
                    name="location"
                    value={values.location}
                    error={touched.location || !values.location ? errors.location : ""}
                    onChange={(e) => setFieldValue("location", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title=" Bên Mời Thầu">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Nhập bên mời thầu..."
                    id="tenderer_id"
                    value={values.tenderer_id!}
                    error={touched.tenderer_id || !values.tenderer_id ? errors.tenderer_id : ""}
                    onChange={(e) => setFieldValue("tenderer_id", e)}
                    options={convertDataOptions(listEnterprise || [])}
                  />
                </FormGroup>
              </Col>

              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title=" Chủ đầu tư">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Nhập chủ đầu tư..."
                    id="investor_id"
                    value={values.investor_id!}
                    error={touched.investor_id || !values.investor_id ? errors.investor_id : ""}
                    options={convertDataOptions(listEnterprise || [])}
                    onChange={(e) => setFieldValue("investor_id", e)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Nguồn tài trợ">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn nguồn tài trợ..."
                    id="funding_source_id"
                    value={values.funding_source_id as string}
                    error={touched.funding_source_id || !values.funding_source_id ? errors.funding_source_id : ""}
                    onChange={(e) => setFieldValue("funding_source_id", e)}
                    options={convertDataOptions(listFundingSources || [])}
                  />
                </FormGroup>
              </Col>

              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Người phê duyệt">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Chọn người phê duyệt..."
                    id="staff_id"
                    value={values.staff_id as string}
                    error={touched.staff_id || !values.staff_id ? errors.staff_id : ""}
                    options={convertDataOptions(getListStaff!)}
                    onChange={(e) => setFieldValue("staff_id", e)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title=" Dịch vụ mua sắm đấu thầu công">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    isMultiple
                    placeholder="Chọn..."
                    id="procurement_id"
                    value={values.procurement_id}
                    error={touched.procurement_id || !values.procurement_id ? errors.procurement_id : ""}
                    onChange={(e) => setFieldValue("procurement_id", e)}
                    options={convertDataOptions(listProcurement || [])}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title=" Ngành Nghề">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    isMultiple
                    placeholder="Chọn ngành nghề..."
                    id="industry_id"
                    value={values.industry_id}
                    error={touched.industry_id || !values.industry_id ? errors.industry_id : ""}
                    onChange={(e) => {
                      setFieldValue("industry_id", e);
                    }}
                    options={convertDataOptions(listIndustry || [])}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Số quyết định ban hành">
                  <FormInput
                    isDisabled={type === EPageTypes.VIEW || type === EPageTypes.APPROVE}
                    placeholder="Nhập số quyết định ban hành..."
                    name="decision_number_issued"
                    value={values.decision_number_issued || ""}
                    error={touched.decision_number_issued || !values.decision_number_issued ? errors.decision_number_issued : ""}
                    onChange={(e) => setFieldValue("decision_number_issued", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Dự án hiện tại">
                  <FormSelect
                    isDisabled={type === EPageTypes.VIEW}
                    placeholder="Nhập thông tin..."
                    id="is_domestic"
                    value={values.is_domestic as unknown as string}
                    options={optionDomestic}
                    error={touched.is_domestic ? errors.is_domestic : ""}
                    onChange={(e) => setFieldValue("is_domestic", e)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Số Tiền">
                  <FormNumber
                    placeholder="Nhập số Tiền..."
                    isDisabled={type === EPageTypes.VIEW}
                    name="amount"
                    value={
                      type === EPageTypes.VIEW
                        ? Number(convertMoney(values.amount as unknown as string)) // Ép kiểu về number
                        : (values.amount as unknown as number) || 0
                    }
                    error={touched.amount || !values.amount ? errors.amount : ""}
                    onChange={(e) => {
                      setFieldValue("amount", e);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Tổng đầu tư">
                  <FormNumber
                    placeholder="Nhập số Tiền..."
                    isDisabled={type === EPageTypes.VIEW}
                    name="total_amount"
                    value={
                      type === EPageTypes.VIEW
                        ? Number(convertMoney(values.total_amount as unknown as string)) // Ép kiểu về number
                        : (values.total_amount as unknown as number) || 0
                    }
                    error={touched.total_amount || !values.total_amount ? errors.total_amount : ""}
                    onChange={(e) => {
                      setFieldValue("total_amount", e);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>

              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Thời Gian Nộp Hồ Sơ">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    value={values.bid_submission_start ? dayjs(values.bid_submission_start) : null}
                    error={touched.bid_submission_start || !values.bid_submission_start ? errors.bid_submission_start : ""}
                    onChange={(date) => setFieldValue("bid_submission_start", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>

              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Ngày kết thúc nộp hồ sơ">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    minDate={values.bid_submission_start ? dayjs(values.bid_submission_start) : undefined}
                    value={values.bid_submission_end ? dayjs(values.bid_submission_end) : null}
                    error={touched.bid_submission_end || !values.bid_submission_end ? errors.bid_submission_end : ""}
                    onChange={(date) => setFieldValue("bid_submission_end", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Ngày Mở Thầu">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    minDate={values.bid_submission_end ? dayjs(values.bid_submission_end) : undefined}
                    value={values.bid_opening_date ? dayjs(values.bid_opening_date) : null}
                    onChange={(date) => setFieldValue("bid_opening_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>

              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Ngày bắt đầu dự án">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    minDate={values.bid_submission_end ? dayjs(values.bid_submission_end) : undefined}
                    value={values.start_time ? dayjs(values.start_time) : null}
                    onChange={(date) => setFieldValue("start_time", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Ngày kết thúc dự án">
                  <FormDate
                    disabled={type === EPageTypes.VIEW}
                    minDate={values.start_time ? dayjs(values.bid_submission_end) : undefined}
                    value={values.end_time ? dayjs(values.end_time) : null}
                    onChange={(date) => setFieldValue("end_time", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              {type === EPageTypes.APPROVE && (
                <Col xs={24} sm={24} md={12} xl={8}>
                  <FormGroup title="Ngày phê duyệt">
                    <FormDate
                      disabled
                      value={values.approve_at ? dayjs(values.approve_at) : dayjs()}
                      onChange={(date) => setFieldValue("approve_at", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                    />
                  </FormGroup>
                </Col>
              )}

              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Trạng thái dự án">
                  <FormSelect
                    isDisabled
                    options={STATUS_PROJECT_ARRAY}
                    id="status"
                    value={values.status && STATUS_PROJECT_ARRAY.find((item) => +item.value === +values.status)?.label}
                    error={touched.status ? errors.status : ""}
                    onChange={(e) => setFieldValue("status", e)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Tài liệu đính kèm">
                  <FormUploadFile
                    isMultiple
                    disabled={type === "view"}
                    name={"files"} // Sử dụng điều kiện để đổi name
                    value={values.files} // Điều kiện chọn giá trị
                    onChange={(e) => {
                      setFieldValue("files", e); // Cập nhật field tương ứng
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Mô Tả">
                  <FormCkEditor
                    disabled={type === EPageTypes.VIEW}
                    id="description"
                    value={values.description ?? ""}
                    onChange={(e) => setFieldValue("description", e)}
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
