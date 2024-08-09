import { unwrapResult } from "@reduxjs/toolkit";
import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormTreeSelect from "@/components/form/FormTreeSelect";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { createBiddingField, getBiddingFieldAllIds, updateBiddingField } from "@/services/store/biddingField/biddingField.thunk";
import lodash from "lodash";
import { IBiddingFieldInitialState } from "@/services/store/biddingField/biddingField.slice";
import { IBiddingField } from "@/services/store/biddingField/biddingField.model";
import { Col, Row } from "antd";
import FormSwitch from "@/components/form/FormSwitch";
import FormInputArea from "@/components/form/FormInputArea";
import { EPageTypes } from "@/shared/enums/page";

interface IActiveBiddingField extends Omit<IBiddingField, "parent"> {
  parent: string[];
}

interface IBiddingFieldFormProps {
  formikRef?: any;
  type: "create" | "view" | "update";
  biddingField?: IActiveBiddingField;
}

export interface IBiddingFieldFormInitialValues {
  name: string;
  description: string;
  code: number;
  is_active: string;
  parent_id: string;
}

const formatTreeData = (data: any[]): { title: string; value: string; key: string; children?: any[] }[] => {
  return data.map((item) => ({
    title: item.name,
    value: item.id.toString(),
    key: item.id.toString(),
    children: item.children ? formatTreeData(item.children) : [],
  }));
};

const BiddingFieldForm = ({ formikRef, type, biddingField }: IBiddingFieldFormProps) => {
  const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
  const { dispatch, state } = useArchive<IBiddingFieldInitialState>("bidding_field");

  const initialValues: IBiddingFieldFormInitialValues = {
    name: biddingField?.name || "",
    description: biddingField?.description || "",
    code: biddingField?.code || 0,
    is_active: biddingField?.is_active ? "1" : "0",
    parent_id: biddingField?.parent_id || "",
  };

  useEffect(() => {
    dispatch(getBiddingFieldAllIds({ query: state.filter }))
      .then(unwrapResult)
      .then((result) => {
        const fields = result.data;
        const formattedData = formatTreeData(fields);
        setTreeData(formattedData);
      });
  }, [dispatch, state.filter]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(data, { setErrors }) => {
        const body = {
          ...lodash.omit(data, "id"),
          parent: data.parent_id ? [data.parent_id] : [],
        };
        if (type === EPageTypes.CREATE) {
          dispatch(createBiddingField({ body }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        } else if (type === EPageTypes.UPDATE) {
          dispatch(updateBiddingField({ body, param: biddingField?.id }))
            .unwrap()
            .catch((error) => {
              const apiErrors = error?.errors || {};
              setErrors(apiErrors);
            });
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => (
        <div>
          <FormGroup title="Thông tin chung">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="text"
                  isDisabled={type === EPageTypes.VIEW}
                  label="Tên của lĩnh vực đấu thầu"
                  value={values.name}
                  name="name"
                  error={touched.name ? errors.name : ""}
                  placeholder="Nhập tên của lĩnh vực đấu thầu..."
                  onChange={(value) => setFieldValue("name", value)}
                  onBlur={handleBlur}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormTreeSelect
                  label="Lĩnh vực cha"
                  isDisabled={type === EPageTypes.VIEW}
                  placeholder="Chọn lĩnh vực cha"
                  treeData={treeData}
                  defaultValue={values.parent_id}
                  onChange={(value) => {
                    setFieldValue("parent_id", value as string);
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormInput
                  type="number"
                  isDisabled={type === EPageTypes.VIEW}
                  label="Mã duy nhất cho lĩnh vực đấu thầu"
                  value={values.code}
                  name="code"
                  onChange={(value) => setFieldValue("code", value)}
                  onBlur={handleBlur}
                  error={touched.code ? errors.code : ""}
                />
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormSwitch
                  isDisabled={type === EPageTypes.VIEW}
                  label="Trạng thái"
                  checked={values.is_active === "1"}
                  onChange={(value) => {
                    setFieldValue("is_active", value ? "1" : "0");
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
                <FormInputArea
                  isReadonly={type === EPageTypes.VIEW}
                  label="Mô tả"
                  placeholder="Nhập mô tả..."
                  name="description"
                  value={values.description}
                  error={touched.description ? errors.description : ""}
                  onChange={(e) => setFieldValue("description", e)}
                />
              </Col>
            </Row>
          </FormGroup>
        </div>
      )}
    </Formik>
  );
};

export default BiddingFieldForm;
