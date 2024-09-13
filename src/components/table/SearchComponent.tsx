import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ISearchParams } from "@/shared/utils/shared-interfaces";
import { useDispatch } from "react-redux";
import { Formik, FormikHelpers, FormikState } from "formik";
import FormInput from "../form/FormInput";
import Button from "../common/Button";
import { Col, Row } from "antd";
import FormSelect from "../form/FormSelect";
import FormDate from "../form/FormDate";
import FormTreeSelect from "../form/FormTreeSelect"; // Import FormTreeSelect
import dayjs from "dayjs";
import React from "react";

export interface ISearchTypeTable {
  type: "text" | "select" | "treeSelect" | "datetime";
  value?: string;
  onChange?: (value: string | string[]) => void;
  isMultiple?: boolean;
  isDisabled?: boolean;
  title?: string;
  placeholder?: string;
  id: string;
  parentItem?: string;
  options?: { value: string; label: string }[];
  treeData?: { title: string; value: string; children?: any[] }[]; // Add treeData for treeSelect
  childItems?: string[];
  valueDefault?: any;
  isClearable?: boolean;
  minDate?: string;
  maxDate?: string;
  label?: string;
}

export interface ISearchProps<T extends ISearchParams> {
  search: ISearchTypeTable[];
  setFilter: ActionCreatorWithPayload<ISearchParams>;
  fetching?: Function;
  filter: T;
  isShow?: boolean;
}

const SearchComponent = <T extends ISearchParams>(props: ISearchProps<T>) => {
  const { search, setFilter, filter, isShow } = props;
  const dispatch = useDispatch();

  return (
    <Formik
      enableReinitialize
      initialValues={filter}
      onSubmit={(values: T, formikHelpers: FormikHelpers<T>) => {
        dispatch(setFilter(values));
        formikHelpers.setSubmitting(false);
      }}
    >
      {({ values, errors, handleBlur, setFieldValue, resetForm, handleSubmit }) => {
        return (
          <div className={`${isShow ? "hidden" : ""} row-gap-3 flex flex-col px-4 py-3`}>
            <Row gutter={[24, 24]} className="row-gap-2 row-gap-lg-3 items-center">
              {search.map((item, index) => {
                if (item.type === "text") {
                  const value: any = values[item.id] || "";

                  return (
                    <Col xs={24} sm={24} md={12} lg={6} key={index}>
                      <FormInput
                        id={item.id}
                        type="text"
                        label={item.label}
                        value={value}
                        placeholder={item.placeholder || "Nhập ..."}
                        onChange={(data) => {
                          setFieldValue(item.id, data);
                          item.onChange && item.onChange(String(data));
                        }}
                        onBlur={handleBlur}
                      />
                    </Col>
                  );
                }

                if (item.type === "select") {
                  const selectedOption = item.options?.find((option) => option.value === values[item.id]);
                  const options = item.parentItem ? (values[item.parentItem] ? item.options : []) : item.options;

                  return (
                    <Col key={index} xs={24} sm={24} md={12} lg={6}>
                      <FormSelect
                        id={item.id}
                        label={item.label}
                        placeholder={item.placeholder}
                        options={options!}
                        value={selectedOption?.value}
                        onChange={(data) => {
                          if (Array.isArray(data)) return;

                          item.childItems?.forEach((child) => {
                            setFieldValue(child, "");
                          });

                          setFieldValue(item.id, data);

                          item.onChange && item.onChange(data);
                        }}
                      />
                    </Col>
                  );
                }

                if (item.type === "treeSelect") {
                  const value = values[item.id] || null;
                  return (
                    <Col key={index} xs={24} sm={24} md={12} lg={6}>
                      <FormTreeSelect
                        label={item.label}
                        placeholder={item.placeholder}
                        treeData={item.treeData!}
                        // @ts-ignore
                        defaultValue={value}
                        // @ts-ignore
                        value={value}
                        isDisabled={item.isDisabled}
                        onChange={(data) => {
                          setFieldValue(item.id, data);
                          item.onChange && item.onChange(data);
                        }}
                        error={errors[item.id] as string}
                      />
                    </Col>
                  );
                }

                if (item.type === "datetime") {
                  const value = values[item.id] || null;

                  return (
                    <Col key={index} xs={24} sm={24} md={12} lg={6}>
                      <FormDate
                        id={item.id}
                        label={item.title}
                        minDate={item.minDate ? dayjs(item.minDate) : undefined}
                        // @ts-ignore
                        value={value ? dayjs(value) : null}
                        maxDate={item.maxDate ? dayjs(item.maxDate) : undefined}
                        onChange={(data) => {
                          if (item.childItems && item.childItems.length > 0) {
                            item.childItems.forEach((child) => {
                              setFieldValue(child, "");
                            });
                          }
                          const result = data ? data.format("YYYY-MM-DD") : null;

                          setFieldValue(item.id, result);
                          item.onChange && item.onChange(result as any);
                        }}
                      />
                    </Col>
                  );
                }

                return <React.Fragment key={index} />;
              })}
            </Row>
            <div className="mt-[12px] flex flex-row items-center justify-center gap-2">
              <Button text={"Tìm kiếm"} onClick={() => handleSubmit()} />
              <Button
                text={"Hủy"}
                onClick={() => {
                  const resetFilter: ISearchParams = {
                    page: 1,
                    size: 10,
                  };
                  dispatch(setFilter(resetFilter));
                  resetForm({ ...resetFilter } as Partial<FormikState<T>>);
                }}
              />
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default SearchComponent;
