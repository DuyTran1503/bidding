import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Col, Form, Row } from "antd";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { useViewport } from "@/hooks/useViewport";
import { IBiddingResult } from "@/services/store/biddingResult/biddingResult.model";
import { IBiddingResultInitialState } from "@/services/store/biddingResult/biddingResult.slice";
import { IProject } from "@/services/store/project/project.model";
import { IEnterprise } from "@/services/store/enterprise/enterprise.model";
import { createBiddingResult, updateBiddingResult } from "@/services/store/biddingResult/biddingResult.thunk";
import { IBidDocument } from "@/services/store/bid_document/bid_document.model";

interface IBiddingResultFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IBiddingResult;
}

const DetailBiddingResult = ({ visible, type, setVisible, item }: IBiddingResultFormProps) => {
  const formikRef = useRef<FormikProps<IBiddingResult>>(null);
  const { dispatch } = useArchive<IBiddingResultInitialState>("bidding_result");
  const { screenSize } = useViewport();

  const initialValues: IBiddingResult = {
    id: item?.id || "",
    project: item?.project as IProject,
    enterprise: item?.enterprise as IEnterprise,
    bid_document: item?.bid_document as IBidDocument,
    win_amount: item?.win_amount || "",
    decision_number: item?.decision_number || "",
    decision_date: item?.decision_date || "",
    is_active: item?.is_active ? "1" : "0",
  };
  const handleSubmit = (data: IBiddingResult, { setErrors }: any) => {
    const body = {
      ...lodash.omit(data, "id", "key", "index"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(createBiddingResult({ body }))
        .unwrap()
        .catch((error) => {
          const apiErrors = error?.errors || {};
          setErrors(apiErrors);
        });;
    } else if (type === EButtonTypes.UPDATE) {
      dispatch(updateBiddingResult({ body, param: item?.id }));
    }
  };

  return (
    <Dialog
      screenSize={screenSize}
      handleSubmit={() => {
        formikRef.current && formikRef.current.handleSubmit();
      }}
      visible={visible}
      setVisible={setVisible}
      title={
        type === EButtonTypes.CREATE
          ? "Tạo mới danh mục bài viết"
          : type === EButtonTypes.UPDATE
            ? "Cập nhật danh mục bài viết"
            : "Chi tiết danh mục bài viết"
      }
      footerContent={
        <div className="flex items-center justify-center gap-2">
          <Button key="cancel" text={"Hủy"} type="secondary" onClick={() => setVisible(false)} />
          {type !== EButtonTypes.VIEW && (
            <Button
              key="submit"
              kind="submit"
              text={"Lưu"}
              onClick={() => {
                formikRef.current && formikRef.current.handleSubmit();
              }}
            />
          )}
        </div>
      }
    >
      <Formik innerRef={formikRef} initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form className="mt-3">
            <Row gutter={[24, 24]}>
              {/* Enterprise Information */}
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Đại diện doanh nghiệp">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.enterprise.representative}
                    name="enterprise.representative"
                    error={touched.enterprise?.representative ? errors.enterprise?.representative : ""}
                    placeholder="Nhập tên đại diện..."
                    onChange={(value) => setFieldValue("enterprise.representative", value)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Số điện thoại doanh nghiệp">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.enterprise.phone}
                    name="enterprise.phone"
                    placeholder="Nhập số điện thoại..."
                    onChange={(value) => setFieldValue("enterprise.phone", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Địa chỉ doanh nghiệp">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.enterprise.address}
                    name="enterprise.address"
                    placeholder="Nhập địa chỉ..."
                    onChange={(value) => setFieldValue("enterprise.address", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Tên dự án">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.project.name}
                    name="project.name"
                    placeholder="Nhập tên dự án..."
                    onChange={(value) => setFieldValue("project.name", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Địa điểm dự án">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.project.location}
                    name="project.location"
                    placeholder="Nhập địa điểm..."
                    onChange={(value) => setFieldValue("project.location", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Ngày bắt đầu dự án">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.project.bid_submission_start}
                    name="project.bid_submission_start"
                    placeholder="Ngày bắt đầu..."
                    onChange={(value) => setFieldValue("project.bid_submission_start", value)}
                  />
                </FormGroup>
              </Col>

              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Ngày nộp hồ sơ dự thầu">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.bid_document?.submission_date}
                    name="bid_document?.submission_date"
                    placeholder="Nhập ngày nộp..."
                    onChange={(value) => setFieldValue("bid_document?.submission_date", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Giá thầu">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.bid_document?.bid_price}
                    name="bid_document?.bid_price"
                    placeholder="Nhập giá thầu..."
                    onChange={(value) => setFieldValue("bid_document?.bid_price", value)}
                  />
                </FormGroup>
              </Col>

              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Số tiền thắng thầu">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.win_amount}
                    name="win_amount"
                    placeholder="Nhập số tiền thắng thầu..."
                    onChange={(value) => setFieldValue("win_amount", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Số quyết định">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.decision_number}
                    name="decision_number"
                    placeholder="Nhập số quyết định..."
                    onChange={(value) => setFieldValue("decision_number", value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12}>
                <FormGroup title="Ngày quyết định">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    value={values.decision_date}
                    name="decision_date"
                    placeholder="Nhập ngày quyết định..."
                    onChange={(value) => setFieldValue("decision_date", value)}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>

        )}
      </Formik>
    </Dialog>
  );
};

export default DetailBiddingResult;
