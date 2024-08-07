import { unwrapResult } from "@reduxjs/toolkit";
import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormTreeSelect from "@/components/form/FormTreeSelect";
import UpdateGrid from "@/components/grid/UpdateGrid";
import { Formik } from "formik";
import { object, string, number } from "yup";
import { useEffect, useState } from "react";
import { createBiddingField, getBiddingFieldAllIds, updateBiddingField } from "@/services/store/biddingField/biddingField.thunk";
import lodash from "lodash";
import { IBiddingFieldInitialState } from "@/services/store/biddingField/biddingField.slice";
import { IBiddingField } from "@/services/store/biddingField/biddingField.model";
import { Col } from "antd";
import FormSwitch from "@/components/form/FormSwitch";

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
  const [loading, setLoading] = useState(true);
  const { dispatch, state } = useArchive<IBiddingFieldInitialState>("biddingfield");

  const initialValues: IBiddingFieldFormInitialValues = {
    name: biddingField?.name || "",
    description: biddingField?.description || "",
    code: biddingField?.code || 0,
    is_active: biddingField?.is_active ? "1" : "0",
    parent_id: biddingField?.parent_id || "",
  };

  const validationSchema = object().shape({
    name: string().required("Vui lòng nhập tên trường đấu giá"),
    description: string().required("Vui lòng nhập mô tả trường đấu giá"),
    code: number().required("Vui lòng nhập mã"),
  });

  useEffect(() => {
    dispatch(getBiddingFieldAllIds({ query: state.filter }))
      .then(unwrapResult)
      .then((result) => {
        const fields = result.data;
        const formattedData = formatTreeData(fields);
        setTreeData(formattedData);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, state.filter]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(data) => {
        const body = {
          ...lodash.omit(data, "id"),
          parent: data.parent_id ? [data.parent_id] : [],
        };
        if (type === "create") {
          dispatch(createBiddingField({ body }));
        } else if (type === "update") {
          dispatch(updateBiddingField({ body, param: biddingField?.id }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => (
        <UpdateGrid
          colNumber="2"
          rate="1-3"
          isLoading={loading}
          groups={{
            colFull: (
              <FormGroup title="Thông tin chung">
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Tên của lĩnh vực đấu thầu"
                  value={values.name}
                  name="name"
                  error={touched.name ? errors.name : ""}
                  placeholder="Nhập tên của lĩnh vực đấu thầu..."
                  onChange={(value) => setFieldValue("name", value)}
                  onBlur={handleBlur}
                />
                <FormInput
                  type="text"
                  isDisabled={type === "view"}
                  label="Mô tả của lĩnh vực đấu thầu"
                  value={values.description}
                  name="description"
                  error={touched.description ? errors.description : ""}
                  placeholder="Nhập mô tả của lĩnh vực đấu thầu..."
                  onChange={(value) => setFieldValue("description", value)}
                  onBlur={handleBlur}
                />
                <FormInput
                  type="number"
                  isDisabled={type === "view"}
                  label="Mã duy nhất cho lĩnh vực đấu thầu"
                  value={values.code}
                  name="code"
                  onChange={(value) => setFieldValue("code", value)}
                  onBlur={handleBlur}
                />
                <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                  <FormGroup title="Trạng thái hoạt động">
                    <FormSwitch
                      checked={!!values.is_active ? true : false}
                      onChange={(value) => {
                        setFieldValue("is_active", value);
                      }}
                    />
                  </FormGroup>
                </Col>
                <FormTreeSelect
                  label="Lĩnh vực cha"
                  isDisabled={type === "view"}
                  placeholder="Chọn lĩnh vực cha"
                  treeData={treeData}
                  defaultValue={values.parent_id}
                  onChange={(value) => {
                    setFieldValue("parent_id", value as string);
                  }}
                />
              </FormGroup>
            ),
          }}
        />
      )}
    </Formik>
  );
};

export default BiddingFieldForm;
