import { Formik, Form } from "formik";
import { date, number, object, string } from "yup";
import lodash from "lodash";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { FormikRefType } from "@/shared/utils/shared-types";
import { EPageTypes } from "@/shared/enums/page";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { IBidDocumentInitialState, resetMessageError } from "@/services/store/bid_document/bid_document.slice";
import { createBidDocument, updateBidDocument } from "@/services/store/bid_document/bid_document.thunk";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormSelect from "@/components/form/FormSelect";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { convertDataOptions } from "../Project/helper";
import dayjs from "dayjs";
import FormDate from "@/components/form/FormDate";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import { getListBidBond } from "@/services/store/bid_bond/bidBond.thunk";
import { IOption } from "@/shared/utils/shared-interfaces";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { IBidDocument } from "@/services/store/bid_document/bid_document.model";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IEnterprise } from "@/services/store/enterprise/enterprise.model";
import { IProject } from "@/services/store/project/project.model";
import { IBidBond } from "@/services/store/bid_bond/bidBond.model";
import { formatTreeSelect } from "@/shared/enums/formatTreeSelect";
import { unwrapResult } from "@reduxjs/toolkit";
import FormTreeSelect from "@/components/form/FormTreeSelect";

interface IBidDocumentFormProps {
  formikRef?: FormikRefType<IBidDocumentInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  bidDocument?: IBidDocumentInitialValues;
  project_id?: number;
  isCreateFromProject?: boolean;
}

export interface IBidDocumentInitialValues {
  id?: number | string;
  project_id?: number;
  enterprise_id?: number | string;
  bid_bond_id?: number | string;
  submission_date?: string;
  bid_price: string;
  implementation_time?: string;
  validity_period?: string;
  technical_score?: string;
  financial_score?: string;
  totalScore?: string;
  ranking: string;
  status: string;
  note: string;
  file?: File | string;
  enterprise?: IEnterprise;
  project?: { id: string; name: string } | IProject;
  bid_bond?: IBidBond;
}

const BidDocumentForm = ({ formikRef, type, bidDocument, project_id, isCreateFromProject }: IBidDocumentFormProps) => {
  const { state, dispatch } = useArchive<IBidDocumentInitialState>("bid_document");
  const { dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: stateBidBond, dispatch: dispatchBidBond } = useArchive<IBidBondInitialState>("bid_bond");
  const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);

  const [initialValues, setInitialValues] = useState<IBidDocumentInitialValues>({
    id: bidDocument?.id ?? "",
    project_id: project_id ? project_id : (bidDocument?.project?.id as number) ?? undefined,
    enterprise_id: bidDocument?.enterprise?.id ?? undefined,
    bid_bond_id: bidDocument?.bid_bond?.id || undefined,
    submission_date: bidDocument?.submission_date ?? "",
    bid_price: bidDocument?.bid_price ?? "",
    implementation_time: bidDocument?.implementation_time ?? "",
    validity_period: bidDocument?.validity_period ?? "",
    technical_score: bidDocument?.technical_score ?? "",
    financial_score: bidDocument?.financial_score ?? "",
    totalScore: bidDocument?.totalScore ?? "",
    ranking: bidDocument?.ranking ?? "",
    status: bidDocument?.status ?? "1",
    note: bidDocument?.note ?? "",
    file: bidDocument?.file || undefined,
  });

  const Schema = object().shape({
    validity_period: string().required("Vui lòng không để trống"),
    implementation_time: string().required("Vui lòng không để trống"),
    bid_price: number().required("Vui lòng không để trống").positive("Giá thầu phải là số dương"),
    submission_date: date().required("Vui lòng không để trống").nullable(),
    bid_bond_id: string().required("Vui lòng không để trống"),
    project_id: string().required("Vui lòng không để trống"),
    enterprise_id: string().required("Vui lòng không để trống"),
  });
  useEffect(() => {
    dispatchProject(getListProject())
      .then(unwrapResult)
      .then((result) => {
        const data = result.data;
        const formattedData = formatTreeSelect(data);
        setTreeData(formattedData);
      });
    dispatchEnterprise(getListEnterprise());
    dispatchBidBond(getListBidBond());
  }, []);
  useEffect(() => {
    return () => {
      dispatch(resetMessageError());
    };
  }, [dispatch]);
  const formattedData: IOption[] =
    stateBidBond?.listBidBonds?.map((bidBond) => ({
      value: bidBond.id,
      label: bidBond.bond_number || "",
    })) || [];

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={(data, { setErrors }: any) => {
        if (type === EPageTypes.CREATE) {
          dispatch(createBidDocument(data as Omit<IBidDocument, "id">))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
          if (state.status === EFetchStatus.FULFILLED || isCreateFromProject) {
            setInitialValues({
              id: "",
              project_id: undefined,
              enterprise_id: undefined,
              bid_bond_id: undefined,
              submission_date: "",
              bid_price: "",
              implementation_time: "",
              validity_period: "",
              technical_score: "",
              financial_score: "",
              totalScore: "",
              ranking: "",
              status: "",
              note: "",
              file: undefined,
            });
          }
        } else if (type === EPageTypes.UPDATE && bidDocument?.id) {
          dispatch(updateBidDocument({ body: lodash.omit(data, "id"), param: String(bidDocument.id) }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        const handleCreateSuccess = () => {
          if (state.status === EFetchStatus.FULFILLED || isCreateFromProject) {
            setInitialValues({
              id: "",
              project_id: undefined,
              enterprise_id: undefined,
              bid_bond_id: undefined,
              submission_date: "",
              bid_price: "",
              implementation_time: "",
              validity_period: "",
              technical_score: "",
              financial_score: "",
              totalScore: "",
              ranking: "",
              status: "",
              note: "",
              file: undefined,
            });
          }
        };

        useEffect(() => {
          handleCreateSuccess();
        }, [state.status, isCreateFromProject]);
        return (
          <Form>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Dự án" required>
                  <FormTreeSelect
                    isDisabled={type === "view" || type === "update"}
                    value={values?.project_id as any}
                    placeholder="Nhập tên dự án..."
                    error={touched.project_id || !values?.project_id ? errors.project_id : ""}
                    onChange={(value) => {
                      setFieldValue("project_id", value as string);
                    }}
                    treeData={treeData}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Doanh nghiệp" required>
                  <FormSelect
                    options={convertDataOptions(stateEnterprise.listEnterprise || [])}
                    error={touched.enterprise_id || !values?.enterprise_id ? errors.enterprise_id : ""}
                    isDisabled={type === "view"}
                    placeholder="Doanh nghiệp..."
                    value={values.enterprise_id as string}
                    id="enterprise_id"
                    onChange={(value) => setFieldValue("enterprise_id", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Mã bảo lãnh" required>
                  <FormSelect
                    options={formattedData}
                    isDisabled={type === "view"}
                    placeholder="Chọn mã lãnh đấu thầu..."
                    value={values.bid_bond_id}
                    error={touched.bid_bond_id || !values?.bid_bond_id ? errors.bid_bond_id : ""}
                    id="bid_bond_id"
                    onChange={(e) => setFieldValue("bid_bond_id", e)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Giá trị đề nghị" required>
                  <FormInput
                    placeholder="Nhập giá trị đề nghị..."
                    name="bid_price"
                    value={values.bid_price}
                    error={touched.bid_price ? errors.bid_price : ""}
                    onChange={(e) => setFieldValue("bid_price", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Thời gian thực hiện" required>
                  <FormDate
                    disabled={type === "view"}
                    error={touched.implementation_time ? errors.implementation_time : ""}
                    value={values.implementation_time ? dayjs(values.implementation_time) : null}
                    onChange={(date) => setFieldValue("implementation_time", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Ngày nộp hồ sơ">
                  <FormDate
                    disabled={type === "view"}
                    error={touched.submission_date ? errors.submission_date : ""}
                    value={values.submission_date ? dayjs(values.submission_date) : null}
                    onChange={(date) => setFieldValue("submission_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormGroup title="Thời hạn hiệu lực">
                  <FormDate
                    disabled={type === "view"}
                    error={touched.validity_period ? errors.validity_period : ""}
                    value={values.validity_period ? dayjs(values.validity_period) : null}
                    onChange={(date) => setFieldValue("validity_period", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Tài liệu đính kèm">
                  <FormUploadFile
                    disabled={type === "view"}
                    name={"file"} // Sử dụng điều kiện để đổi name
                    value={values.file} // Điều kiện chọn giá trị
                    error={touched.file ? errors.file : ""}
                    onChange={(e) => {
                      setFieldValue("file", e); // Cập nhật field tương ứng
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Ghi chú">
                  <FormCkEditor
                    id="note"
                    direction="vertical"
                    value={values.note}
                    error={touched.note ? errors.note : ""}
                    setFieldValue={setFieldValue}
                    disabled={type === "view"}
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

export default BidDocumentForm;
