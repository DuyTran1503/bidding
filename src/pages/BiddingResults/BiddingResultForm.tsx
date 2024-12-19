import FormDate from "@/components/form/FormDate";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IBidDocument } from "@/services/store/bid_document/bid_document.model";
import { IBidDocumentInitialState } from "@/services/store/bid_document/bid_document.slice";
import { getListBidDocument } from "@/services/store/bid_document/bid_document.thunk";
import { IBiddingResult } from "@/services/store/biddingResult/biddingResult.model";
import { IBiddingResultInitialState, resetStatus } from "@/services/store/biddingResult/biddingResult.slice";
import { createBiddingResult, updateBiddingResult } from "@/services/store/biddingResult/biddingResult.thunk";
import { IEnterprise } from "@/services/store/enterprise/enterprise.model";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IProject } from "@/services/store/project/project.model";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { Col, Form, Row } from "antd";
import dayjs from "dayjs";
import { Formik } from "formik";
import lodash from "lodash";
import { useEffect } from "react";
import { convertDataOptions } from "../Project/helper";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import FormNumber from "@/components/form/FormNumber";
import { schemaBiddingResults } from "@/shared/Schema/schema";

interface IBiddingResultFormProps {
  formikRef?: any;
  type?: EButtonTypes;
  biddingResult?: IBiddingResult;
  isOutSide?: boolean;
  listEnterprises?: IEnterprise[];
  isDialog?: boolean;
  setVisible?: () => void;
  optionDocs?: any[];
}

export interface IBiddingResultFormInitialValues {
  project: IProject;
  enterprise: IEnterprise;
  decision_number: string;
  decision_date: string;
  is_active: string;
}

const BiddingResultForm = ({
  formikRef,
  type,
  biddingResult,
  isOutSide,
  listEnterprises,
  isDialog,
  setVisible,
  optionDocs,
}: IBiddingResultFormProps) => {
  const { state, dispatch } = useArchive<IBiddingResultInitialState>("bidding_result");
  const { dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateBidDoc, dispatch: dispatchBidDoc } = useArchive<IBidDocumentInitialState>("bid_document");
  const initialValues: IBiddingResult = {
    id: biddingResult?.id || "",
    project: biddingResult?.project as IProject,
    enterprise: biddingResult?.enterprise as IEnterprise,
    enterprise_id: biddingResult?.enterprise.id ?? undefined,
    project_id: biddingResult?.project?.id ?? undefined,
    bid_document: biddingResult?.bid_document as IBidDocument,
    win_amount: (() => {
      const value = parseFloat(biddingResult?.win_amount as unknown as string);
      return isNaN(value) ? undefined : Math.floor(value); // Ensure this returns a number
    })(),
    decision_number: biddingResult?.decision_number || "",
    decision_date: biddingResult?.decision_date || "",
    is_active: biddingResult?.is_active ? "1" : "0",
    bid_document_id: isDialog ? (biddingResult?.bid_document.id as number) : biddingResult?.bid_document_id || undefined,
  };

  const handleSubmit = (data: IBiddingResult, { setErrors }: any) => {
    const body = {
      ...lodash.omit(data, "id", "key", "index", "project", "enterprise", "bid_document", "project_id", "enterprise_id"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(createBiddingResult({ body }))
        .unwrap()
        .then(() => {
          setVisible && setVisible(); // Call the function passed from parent
        })
        .catch((error) => {
          const apiErrors = error?.errors || {};
          setErrors(apiErrors);
        });
    } else if (type === EButtonTypes.UPDATE) {
      dispatch(updateBiddingResult({ body, param: biddingResult?.id }));
    }
  };
  useEffect(() => {
    dispatchProject(getListProject());
    dispatchBidDoc(getListBidDocument());
    if (!isOutSide) {
      dispatchEnterprise(getListEnterprise());
    }
  }, [isOutSide]);

  useFetchStatus({
    module: "bidding_result",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });
  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={schemaBiddingResults}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue, handleBlur }) => {
        return (
          <Form className="mt-3">
            <Row gutter={[16, 16]}>
              {type === EButtonTypes.VIEW && (
                <>
                  <Col xs={24} sm={24} md={12} xl={12}>
                    <FormGroup title="Đại diện doanh nghiệp" required>
                      <FormSelect
                        isDisabled={type === "view"}
                        value={values.enterprise_id}
                        id="enterprise_id"
                        options={convertDataOptions(listEnterprises || [])}
                        placeholder="Nhập tên đại diện..."
                        onChange={(value) => setFieldValue("enterprise_id", value)}
                      />
                    </FormGroup>
                  </Col>

                  <Col xs={24} sm={24} md={12} xl={12}>
                    <FormGroup title="Tên dự án" required>
                      <FormSelect
                        options={convertDataOptions(stateProject.listProjects || [])}
                        isDisabled={type === "view"}
                        value={values.project_id}
                        id="project_id"
                        placeholder="Nhập tên dự án..."
                        error={touched.project_id || !values.project_id ? errors.project_id : ""}
                        onChange={(value) => setFieldValue("project_id", value)}
                      />
                    </FormGroup>
                  </Col>
                </>
              )}
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Hồ sơ trúng thầu" required>
                  <FormSelect
                    options={convertDataOptions((stateBidDoc.listDocuments as { id: string; name: string }[]) || []) || optionDocs}
                    isDisabled={type === "view"}
                    value={values.bid_document_id}
                    id="bid_document_id"
                    placeholder="Chọn hồ sơ..."
                    error={touched.bid_document_id || !values.bid_document_id ? errors.bid_document_id : ""}
                    onChange={(value) => setFieldValue("bid_document_id", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Số tiền thắng thầu" required>
                  <FormNumber
                    placeholder="Nhập số Tiền..."
                    isDisabled={type === EButtonTypes.VIEW}
                    name="win_amount"
                    value={
                      type === EButtonTypes.VIEW
                        ? Number(convertMoney(values.win_amount as unknown as string)) // Ép kiểu về number
                        : (values.win_amount as unknown as number) || 0
                    }
                    error={touched.win_amount || !values.win_amount ? errors.win_amount : ""}
                    onChange={(e) => {
                      setFieldValue("win_amount", e);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Số quyết định" required>
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.decision_number}
                    name="decision_number"
                    error={touched.decision_number || !values.decision_number ? errors.decision_number : ""}
                    placeholder="Nhập số quyết định..."
                    onChange={(value) => setFieldValue("decision_number", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Ngày quyết định" required>
                  <FormDate
                    disabled={type === EButtonTypes.VIEW}
                    error={touched.decision_date || !values.decision_date ? errors.decision_date : ""}
                    value={values.decision_date ? dayjs(values.decision_date) : null}
                    onChange={(date) => setFieldValue("decision_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
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

export default BiddingResultForm;
