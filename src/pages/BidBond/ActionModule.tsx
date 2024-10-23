import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Form, Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import { IBidBond } from "@/services/store/bid_bond/bidBond.model";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import FormDate from "@/components/form/FormDate";
import dayjs from "dayjs";
import { useViewport } from "@/hooks/useViewport";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import FormSelect from "@/components/form/FormSelect";
import { convertEnum } from "@/shared/utils/common/convertEnum";
import { domesticEnumArray } from "@/shared/enums/domestic";
import { IOption } from "@/shared/utils/shared-interfaces";
import { bidBondEnumArray, mappingBidBond } from "@/shared/enums/types";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { convertDataOptions } from "../Project/helper";
import { getListProject } from "@/services/store/project/project.thunk";
import { createBidBond, updateBidBond } from "@/services/store/bid_bond/bidBond.thunk";

interface IBidBondFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IBidBond;
}

export interface IBidBondValues {
  id: string;
  name: string;
  path?: File;
  is_active: string;
}

const ActionModule = ({ visible, type, setVisible, item }: IBidBondFormProps) => {
  const formikRef = useRef<FormikProps<IBidBond>>(null);
  const { state, dispatch } = useArchive<IBidBondInitialState>("bid_bond");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { screenSize } = useViewport();
  const initialValues: IBidBond = {
    id: item?.id || "",
    project_id: item?.project_id || "",
    enterprise_id: item?.enterprise_id ?? "",
    bond_amount: 0,
    bond_type: "",
    bond_number: "",
    issue_date: "",
    expiry_date: "",
  };
  const handleSubmit = (data: IBidBond) => {
    const body = {
      ...lodash.omit(data, "id"),
    };
    console.log(body);

    if (type === EButtonTypes.CREATE) {
      dispatch(createBidBond({ body: body }));
    } else if (type === EButtonTypes.UPDATE && item?.id) {
      //   const newData = item.path === body.path ? (({ ...rest }) => rest)(body) : body;
      //   dispatch(updateBidBond({ body: newData, param: item?.id }));
    }
  };
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      setVisible(false);
    }
  }, [state.status]);
  const optionType: IOption[] = bidBondEnumArray.map((e) => ({
    label: mappingBidBond[e],
    value: e,
  }));
  useEffect(() => {
    if (!!visible) {
      dispatchEnterprise(getListEnterprise());
      dispatchProject(getListProject());
    }
  }, [visible]);
  return (
    <Dialog
      handleSubmit={() => {
        formikRef.current && formikRef.current.handleSubmit();
      }}
      screenSize={screenSize}
      visible={visible}
      setVisible={setVisible}
      title={
        type === EButtonTypes.CREATE
          ? "Thêm mới bảo lãnh dự thầu"
          : type === EButtonTypes.UPDATE
            ? "Cập nhật bảo lãnh dự thầu"
            : "Chi tiết bảo lãnh dự thầu"
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
        {({ values, handleBlur, setFieldValue }) => (
          <Form className="mt-3">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Mã bảo lãnh"
                  value={values.bond_number}
                  name="bond_number"
                  placeholder="Nhập mã bảo lãnh..."
                  onChange={(value) => setFieldValue("bond_number", value)}
                  onBlur={handleBlur}
                />
              </Col>

              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSelect
                  options={convertDataOptions(stateEnterprise.listEnterprise || [])}
                  isDisabled={type === "view"}
                  label="Người hoặc tổ chức bảo lãnh"
                  value={values.enterprise_id}
                  id="enterprise_id"
                  placeholder="Nhập tên dự án..."
                  onChange={(value) => setFieldValue("enterprise_id", value)}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSelect
                  isDisabled={type === "view"}
                  label="Tên dự án"
                  value={values.project_id}
                  id="project_id"
                  placeholder="Nhập tên dự án..."
                  onChange={(value) => setFieldValue("project_id", value)}
                  options={convertDataOptions(stateProject.listProjects || [])}
                />
              </Col>

              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSelect
                  isDisabled={type === "view"}
                  label="Loại bảo lãnh"
                  value={values.bond_type}
                  id="bond_type"
                  options={optionType}
                  placeholder="Nhập loại bảo lãnh..."
                  onChange={(value) => setFieldValue("bond_type", value)}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Số tiền bảo lãnh"
                  value={values.bond_amount}
                  name="bond_amount"
                  placeholder="Nhập số tiền bảo lãnh..."
                  onChange={(value) => setFieldValue("bond_amount", value)}
                  onBlur={handleBlur}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormDate
                  disabled={type === "view"}
                  label="Ngày phát hành"
                  value={values.issue_date ? dayjs(values.issue_date) : null}
                  onChange={(date) => setFieldValue("issue_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormDate
                  disabled={type === "view"}
                  label="Ngày hết hạn"
                  value={values.expiry_date ? dayjs(values.expiry_date) : null}
                  onChange={(date) => setFieldValue("expiry_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                />
              </Col>
            </Row>

            {/* <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSwitch
                  label="Trạng thái"
                  checked={values.is_active === "1"}
                  onChange={(value) => {
                    setFieldValue("is_active", value ? "1" : "0");
                  }}
                />
              </Col>
            </Row> */}
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ActionModule;
