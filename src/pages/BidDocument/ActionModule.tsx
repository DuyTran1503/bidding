import { Formik, Form } from "formik";
import { object, string } from "yup";
import lodash from "lodash";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { FormikRefType } from "@/shared/utils/shared-types";
import { EPageTypes } from "@/shared/enums/page";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { IBidDocumentInitialState, resetMessageError } from "@/services/store/bid_document/bid_document.slice";
import { createBidDocument, updateBidDocument } from "@/services/store/bid_document/bid_document.thunk";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormSelect from "@/components/form/FormSelect";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { convertDataOptions } from "../Project/helper";
import dayjs from "dayjs";
import FormDate from "@/components/form/FormDate";
import FormSwitch from "@/components/form/FormSwitch";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";

interface IBidDocumentFormProps {
  formikRef?: FormikRefType<IBidDocumentInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  bidDocument?: IBidDocumentInitialValues;
}

export interface IBidDocumentInitialValues {
  id?: number | string;
  project_id?: string;
  enterprise_id: number | string;
  bid_bond_id: number | string;
  submission_date?: string;
  bid_price: string;
  implementation_time?: string;
  validity_period?: string;
  technical_score?: string;
  financial_score?: string;
  totalScore?: string;
  ranking: string;
  status: string;
  notes: string;
}

const BidDocumentForm = ({ formikRef, type, bidDocument }: IBidDocumentFormProps) => {
  const { dispatch } = useArchive<IBidDocumentInitialState>("bid_document");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");

  const initialValues: IBidDocumentInitialValues = {
    id: bidDocument?.id ?? "",
    project_id: bidDocument?.project_id ?? undefined,
    enterprise_id: bidDocument?.enterprise_id ?? "",
    bid_bond_id: bidDocument?.bid_bond_id ?? "",
    submission_date: bidDocument?.submission_date ?? "",
    bid_price: bidDocument?.bid_price ?? "",
    implementation_time: bidDocument?.implementation_time ?? "",
    validity_period: bidDocument?.validity_period ?? "",
    technical_score: bidDocument?.technical_score ?? "",
    financial_score: bidDocument?.financial_score ?? "",
    totalScore: bidDocument?.totalScore ?? "",
    ranking: bidDocument?.ranking ?? "",
    status: bidDocument?.status ?? "",
    notes: bidDocument?.notes ?? "",
  };
  const Schema = object().shape({});
  useEffect(() => {
    dispatchProject(getListProject());
    dispatchEnterprise(getListEnterprise());
  }, []);
  useEffect(() => {
    return () => {
      dispatch(resetMessageError());
    };
  }, []);
  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={(data) => {
        if (type === EPageTypes.CREATE) {
          dispatch(createBidDocument({ body: lodash.omit(data, "id") }));
          console.log(data);
        } else if (type === EPageTypes.UPDATE && bidDocument?.id) {
          dispatch(updateBidDocument({ body: lodash.omit(data, "id"), param: String(bidDocument.id) }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        console.log(errors);

        return (
          <Form>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Dự án">
                  <FormSelect
                    isDisabled={type === "view"}
                    label="Tên dự án"
                    value={values.project_id}
                    id="project_id"
                    placeholder="Nhập tên dự án..."
                    onChange={(value) => setFieldValue("project_id", value)}
                    options={convertDataOptions(stateProject.listProjects || [])}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Doanh nghiệp">
                  <FormSelect
                    options={convertDataOptions(stateEnterprise.listEnterprise || [])}
                    isDisabled={type === "view"}
                    label="Doanh nghiệp"
                    placeholder="Doanh nghiệp..."
                    value={values.enterprise_id as string}
                    id="enterprise_id"
                    onChange={(value) => setFieldValue("enterprise_id", value)}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Bảo lãnh đấu thầu">
                  <FormInput
                    label="Bảo lãnh đấu thầu"
                    placeholder="Nhập bảo lãnh đấu thầu..."
                    name="bid_bond_id"
                    value={values.bid_bond_id}
                    error={touched.bid_bond_id ? errors.bid_bond_id : ""}
                    onChange={(e) => setFieldValue("bid_bond_id", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Ngày nộp">
                  <FormDate
                    disabled={type === "view"}
                    label="Ngày nộp"
                    value={values.submission_date ? dayjs(values.submission_date) : null}
                    onChange={(date) => setFieldValue("submission_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Giá trị đề nghị">
                  <FormInput
                    label="Giá trị đề nghị"
                    placeholder="Nhập giá trị đề nghị..."
                    name="bid_price"
                    value={values.bid_price}
                    error={touched.bid_price ? errors.bid_price : ""}
                    onChange={(e) => setFieldValue("bid_price", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Thời gian thực hiện">
                  <FormDate
                    disabled={type === "view"}
                    label="Thời gian thực hiện"
                    value={values.implementation_time ? dayjs(values.implementation_time) : null}
                    onChange={(date) => setFieldValue("implementation_time", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Thời hạn hiệu lực">
                  <FormDate
                    disabled={type === "view"}
                    label="Thời hạn hiệu lực"
                    value={values.validity_period ? dayjs(values.validity_period) : null}
                    onChange={(date) => setFieldValue("validity_period", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Điểm kỹ thuật">
                  <FormInput
                    label="Điểm kỹ thuật"
                    placeholder="Nhập điểm kỹ thuật..."
                    name="technical_score"
                    value={values.technical_score}
                    error={touched.technical_score ? errors.technical_score : ""}
                    onChange={(e) => setFieldValue("technical_score", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Điểm tài chính">
                  <FormInput
                    label="Điểm tài chính"
                    placeholder="Nhập điểm tài chính..."
                    name="financial_score"
                    value={values.financial_score}
                    error={touched.financial_score ? errors.financial_score : ""}
                    onChange={(e) => setFieldValue("financial_score", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Tổng điểm">
                  <FormInput
                    label="Tổng điểm"
                    placeholder="Nhập tổng điểm..."
                    name="totalScore"
                    value={values.totalScore}
                    error={touched.totalScore ? errors.totalScore : ""}
                    onChange={(e) => setFieldValue("totalScore", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Xếp hạng">
                  <FormInput
                    label="Xếp hạng"
                    placeholder="Nhập xếp hạng..."
                    name="ranking"
                    value={values.ranking}
                    error={touched.ranking ? errors.ranking : ""}
                    onChange={(e) => setFieldValue("ranking", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title="Trạng thái">
                  <FormSwitch checked={!!values.status} onChange={(value) => setFieldValue("status", value)} />
                </FormGroup>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormGroup title="Ghi chú">
                  <FormCkEditor id="description" direction="vertical" value={values.notes} setFieldValue={setFieldValue} disabled={type === "view"} />
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
