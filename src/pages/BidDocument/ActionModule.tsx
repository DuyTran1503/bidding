import { Formik, Form } from "formik";
import { object, string } from "yup";
import lodash from "lodash";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { FormikRefType } from "@/shared/utils/shared-types";
import { EPageTypes } from "@/shared/enums/page";
import FormSwitch from "@/components/form/FormSwitch";
import FormInputArea from "@/components/form/FormInputArea";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { IBidDocumentInitialState, resetMessageError } from "@/services/store/bid_document/bid_document.slice";
import { createBidDocument, updateBidDocument } from "@/services/store/bid_document/bid_document.thunk";
import FormCkEditor from "@/components/form/FormCkEditor";

interface IBidDocumentFormProps {
  formikRef?: FormikRefType<IBidDocumentInitialValues>;
  type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
  bidDocument?: IBidDocumentInitialValues;
}

export interface IBidDocumentInitialValues {
  id?: number | string;
  id_project: number | string;
  id_enterprise: number | string;
  id_bid_bond: number | string;
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
  const initialValues: IBidDocumentInitialValues = {
    id: bidDocument?.id ?? "",
    id_project: bidDocument?.id_project ?? "",
    id_enterprise: bidDocument?.id_enterprise ?? "",
    id_bid_bond: bidDocument?.id_bid_bond ?? "",
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
  const tagSchema = object().shape({
    name: string().trim().required("Vui lòng không để trống trường này"),
  });
  useEffect(() => {
    return () => {
      dispatch(resetMessageError());
    };
  }, []);
  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={tagSchema}
      onSubmit={(data) => {
        if (type === EPageTypes.CREATE) {
          dispatch(createBidDocument({ body: lodash.omit(data, "id") }));
        } else if (type === EPageTypes.UPDATE && bidDocument?.id) {
          dispatch(updateBidDocument({ body: lodash.omit(data, "id"), param: String(bidDocument.id) }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => (
        <Form>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title=" Dự án">
                <FormInput
                  label=" Dự án"
                  placeholder="Nhập  dự án..."
                  name="id_project"
                  value={values.id_project}
                  error={touched.id_project ? errors.id_project : ""}
                  onChange={(e) => setFieldValue("id_project", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title=" Tài liệu đấu thầu">
                <FormInput
                  label=" Tài liệu đấu thầu"
                  placeholder="Nhập  tài liệu đấu thầu..."
                  name="id_enterprise"
                  value={values.id_enterprise}
                  error={touched.id_enterprise ? errors.id_enterprise : ""}
                  onChange={(e) => setFieldValue("id_enterprise", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title=" Bảo lãnh đấu thầu">
                <FormInput
                  label=" Bảo lãnh đấu thầu"
                  placeholder="Nhập  bảo lãnh đấu thầu..."
                  name="id_bid_bond"
                  value={values.id_bid_bond}
                  error={touched.id_bid_bond ? errors.id_bid_bond : ""}
                  onChange={(e) => setFieldValue("id_bid_bond", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Ngày nộp">
                <FormInput
                  label="Ngày nộp"
                  placeholder="Nhập ngày nộp..."
                  name="submission_date"
                  value={values.submission_date}
                  error={touched.submission_date ? errors.submission_date : ""}
                  onChange={(e) => setFieldValue("submission_date", e)}
                  onBlur={handleBlur}
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
                <FormInput
                  label="Thời gian thực hiện"
                  placeholder="Nhập thời gian thực hiện..."
                  name="implementation_time"
                  value={values.implementation_time}
                  error={touched.implementation_time ? errors.implementation_time : ""}
                  onChange={(e) => setFieldValue("implementation_time", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
              <FormGroup title="Thời hạn hiệu lực">
                <FormInput
                  label="Thời hạn hiệu lực"
                  placeholder="Nhập thời hạn hiệu lực..."
                  name="validity_period"
                  value={values.validity_period}
                  error={touched.validity_period ? errors.validity_period : ""}
                  onChange={(e) => setFieldValue("validity_period", e)}
                  onBlur={handleBlur}
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
                <FormInput
                  label="Trạng thái"
                  placeholder="Nhập trạng thái..."
                  name="status"
                  value={values.status}
                  error={touched.status ? errors.status : ""}
                  onChange={(e) => setFieldValue("status", e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
              <FormGroup title="Ghi chú">
                <FormCkEditor
                  id="description"
                  direction="vertical"
                  value={values.notes}
                  setFieldValue={setFieldValue}
                  disabled={type === EPageTypes.VIEW}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default BidDocumentForm;
