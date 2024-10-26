import Button from "@/components/common/Button";
import Dialog from "@/components/dialog/Dialog";
import FormCkEditor from "@/components/form/FormCkEditor";
import FormDate from "@/components/form/FormDate";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { useArchive } from "@/hooks/useArchive";
import { useViewport } from "@/hooks/useViewport";
import { IBidBond } from "@/services/store/bid_bond/bidBond.model";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import { createBidBond } from "@/services/store/bid_bond/bidBond.thunk";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { bidBondEnumArray, mappingBidBond } from "@/shared/enums/types";
import { IOption } from "@/shared/utils/shared-interfaces";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import { Form, Formik, FormikProps } from "formik";
import lodash from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { number, object, string } from "yup";
import { convertDataOptions } from "../Project/helper";

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
    project_id: item?.project_id || undefined,
    enterprise_id: item?.enterprise_id ?? undefined,
    bond_amount: item?.bond_amount ?? 0,
    bond_type: item?.bond_type ?? undefined,
    bond_number: item?.bond_number ?? "",
    issue_date: item?.issue_date ?? "",
    expiry_date: item?.expiry_date ?? "",
    description: item?.description ?? "",
    bond_amount_in_words: item?.bond_amount_in_words ?? "",
  };
  // console.log(initialValues);

  const stringRegex =  /^[\p{L}0-9\s._`-]*$/u;
  const Schema = object().shape({
    project_id: string().matches(stringRegex, "Không được chưa ký tự đặc biệt").required("Vui lòng chọn tên dự án"),
    enterprise_id: string().matches(stringRegex, "Không được chưa ký tự đặc biệt").required("Vui lòng chọn người hoặc tổ chức bảo lãnh"),
    bond_amount: number().moreThan(0, "Giá trị phải lớn hơn 0").required("Vui lòng nhập số tiền"),
    bond_type: string().matches(stringRegex, "Không được chưa ký tự đặc biệt").required("Vui lòng chọn loại bảo lãnh"),
    bond_number: string().required("Vui lòng nhập mã dự án"),
    bond_amount_in_words: string().required("Vui lòng không để trống ô này")
    // issue_date
    // expiry_date
    // description
  });

  const handleSubmit = (data: IBidBond) => {
    const body = {
      ...lodash.omit(data, "id"),
    };
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
      <Formik innerRef={formikRef} initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit} validationSchema={Schema}>
        {({ values, handleBlur, errors, touched, setFieldValue }) => {
          
          return(
          <Form className="mt-3">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Mã bảo lãnh"
                  value={values.bond_number}
                  name="bond_number"
                  error={touched.bond_number ? errors.bond_number: "" }
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
                  error={touched.enterprise_id ? errors.enterprise_id: "" }
                  placeholder="Chọn người hoặc tổ chức bảo lãnh"
                  onChange={(value) => setFieldValue("enterprise_id", value)}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSelect
                  isDisabled={type === "view"}
                  label="Tên dự án"
                  value={values.project_id}
                  id="project_id"
                  placeholder="Tên dự án..."
                  error={touched.project_id ? errors.project_id: "" }
                  onChange={(value) => setFieldValue("project_id", value)}
                  options={convertDataOptions(stateProject.listProjects || [])}
                />
              </Col>

              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSelect
                  isDisabled={type === "view"}
                  label="Loại bảo lãnh"
                  value={values.bond_type}
                  error={touched.bond_type ? errors.bond_type: "" }
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
                  error={touched.bond_amount ? errors.bond_amount: "" }
                  name="bond_amount"
                  placeholder="Nhập số tiền bảo lãnh..."
                  onChange={(value) => setFieldValue("bond_amount", value)}
                  onBlur={handleBlur}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Số tiền bảo bằng chữ"
                  value={values.bond_amount_in_words}
                  error={touched.bond_amount_in_words ? errors.bond_amount_in_words: "" }
                  name="bond_amount_in_words"
                  placeholder="Nhập số tiền bảo lãnh bằng chữ..."
                  onChange={(value) => setFieldValue("bond_amount_in_words", value)}
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
                  minDate={values.issue_date ? dayjs(values.issue_date).add(1, "day") : undefined}
                  value={values.expiry_date ? dayjs(values.expiry_date) : null}
                  onChange={(date) => setFieldValue("expiry_date", dayjs(date?.toISOString()).format("YYYY-MM-DD"))}
                />
              </Col>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormCkEditor
                  id="description"
                  direction="vertical"
                  value={String(values?.description)}
                  setFieldValue={setFieldValue}
                  disabled={type === EButtonTypes.VIEW}
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
        )}}
      </Formik>
    </Dialog>
  );
};

export default ActionModule;
