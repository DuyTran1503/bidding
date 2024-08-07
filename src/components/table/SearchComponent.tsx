import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ISearchTable } from "./PrimaryTable";
import { ISearchParams } from "@/shared/utils/shared-interfaces";
import { useDispatch } from "react-redux";
import { Formik, FormikHelpers, FormikState, FormikValues } from "formik";
import FormInput from "../form/FormInput";
import React from "react";
import Button from "../common/Button";
import { IoSearchOutline } from "react-icons/io5";
import { Col, Row } from "antd";
import FormSelect from "../form/FormSelect";
import FormDate from "../form/FormDate";
import dayjs from "dayjs";
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
  childItems?: string[];
  valueDefault?: any;
  isClearable?: boolean;
  minDate?: string;
  maxDate?: string;
  label?: string;
}
interface ITreeSelectOption {
  value: string;
  label: string;
  children?: ITreeSelectOption[];
}

export interface ISearchProps<T extends ISearchParams> {
  search: ISearchTypeTable[];
  setFilter: ActionCreatorWithPayload<ISearchParams>;
  fetching?: Function;
  filter: T;
  isShow?: boolean;
}

const SearchComponent = <T extends ISearchParams>(props: ISearchProps<T>) => {
  const { search, setFilter, fetching, filter, isShow } = props;
  const dispatch = useDispatch();
  return (
    <Formik
      enableReinitialize
      initialValues={filter}
      onSubmit={(values: T) => {
        // Handle form submission
        dispatch(setFilter(values));
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue, resetForm, handleSubmit }) => {
        return (
          <div className={`${isShow ? "hidden" : ""} row-gap-3 flex flex-col px-4 py-3`}>
            <Row className="row-gap-2 row-gap-lg-3">
              {search.length &&
                search?.map((item, index) => {
                  if (item.type === "text") {
                    // @ts-ignore
                    const value: any = values && [item.id] ? values[item.id] : "";

                    return (
                      <Col xs={12} sm={12} md={6} lg={4} key={index}>
                        <FormInput
                          id={item.id}
                          // icon={IoSearchOutline}
                          type="text"
                          label={item.label}
                          value={value ?? ""}
                          // error={errors[item.id]}
                          placeholder="Nhập ..."
                          onChange={(data) => {
                            setFieldValue(item.id, data).then();
                            item.onChange && item.onChange(String(data));
                          }}
                          onBlur={handleBlur}
                        />
                      </Col>
                    );
                  }
                  if (item.type === "select") {
                    // @ts-ignore
                    const value =
                      // @ts-ignore
                      values && values[item.id]
                        ? // @ts-ignore
                          item.options?.find((option) => option.value === values[item.id])
                        : null;
                    const options = item.parentItem ? (values[item.parentItem] ? item.options : []) : item.options;
                    return (
                      <Col key={index} xs={12}>
                        <FormSelect
                          // isClearable={item?.isClearable ?? true}
                          id={item.id!}
                          label={item.title}
                          placeholder={item.placeholder}
                          // value={value}
                          options={options!}
                          onChange={(data) => {
                            if (Array.isArray(data)) return;

                            // reset child value
                            item.childItems?.forEach((child) => {
                              setFieldValue(child, "").then(() => {});
                            });

                            // set value
                            setFieldValue(item.id, data).then(() => {});

                            if (!data && item?.valueDefault) {
                              item.onChange && item.onChange(data ?? "");
                              return;
                            }

                            if (data && data) {
                              item.onChange && item.onChange(data);
                              return;
                            }
                          }}
                        />
                      </Col>
                    );
                  }
                  if (item.type === "datetime") {
                    // @ts-ignore
                    const value = values && values[item.id] ? values[item.id] : null;

                    return (
                      <Col key={index} xs={12}>
                        <FormDate
                          id={item.id}
                          label={item.title}
                          minDate={item.minDate ? dayjs(item.minDate) : undefined}
                          // @ts-ignore
                          value={value ? dayjs(value) : null}
                          maxDate={item.maxDate ? dayjs(item.maxDate) : undefined}
                          onChange={(data) => {
                            if (item?.childItems && item?.childItems.length > 0) {
                              item.childItems?.forEach((child) => {
                                setFieldValue(child, "").then(() => {});
                              });
                            }
                            const result = data ? data.format("YYYY-MM-DD") : null;

                            setFieldValue(item.id, result).then();
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
              <Button text={"Tìm kiếm"} onClick={handleSubmit} />
              <Button
                text={"Hủy"}
                onClick={() => {
                  const resetFilter: ISearchParams = {
                    page: 1,
                    size: 10,
                  };
                  dispatch(setFilter(resetFilter));
                  resetForm(resetFilter as Partial<FormikState<T>>);
                  handleSubmit();
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
