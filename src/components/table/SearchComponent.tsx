import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { IOption, ISearchParams } from "@/shared/utils/shared-interfaces";
import { useDispatch } from "react-redux";
import { Formik, FormikHelpers, FormikState } from "formik";
import FormInput from "../form/FormInput";
import Button from "../common/Button";
import { Col, message, Row } from "antd";
import FormSelect from "../form/FormSelect";
import FormDate from "../form/FormDate";
import FormTreeSelect from "../form/FormTreeSelect"; // Import FormTreeSelect
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface ISearchTypeTable {
  type: "text" | "select" | "treeSelect" | "datetime" | "number" | "numberRange";
  rangeFields?: { minField: string; maxField: string };
  value?: string;
  onChange?: (value: string | string[]) => void;
  isMultiple?: boolean;
  isDisabled?: boolean;
  title?: string;
  placeholder?: string;
  id: string;
  parentItem?: string;
  options?: { value: string; label: string }[] | IOption[];
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
interface IValues {
  [key: string]: any; // Có thể thay đổi kiểu nếu bạn biết trước các kiểu dữ liệu
}
const SearchComponent = <T extends ISearchParams>(props: ISearchProps<T>) => {
  const { search, setFilter, filter, isShow } = props;

  const dispatch = useDispatch();
  const location = useLocation();
  const transformValues = (values: IValues): IValues => {
    const newValues: IValues = {};

    for (const key in values) {
      if (Array.isArray(values[key])) {
        values[key].forEach((item: string, index: number) => {
          newValues[`${key}[${index}]`] = item;
        });
      } else {
        newValues[key] = values[key];
      }
    }

    return newValues;
  };
  useEffect(() => {
    const resetFilter: ISearchParams = {
      page: 1,
      size: 10,
    };
    dispatch(setFilter(resetFilter));
  }, [location.pathname, dispatch, setFilter]);
  return (
    <Formik
      enableReinitialize
      initialValues={filter}
      onSubmit={(values: T, formikHelpers: FormikHelpers<T>) => {
        dispatch(setFilter(transformValues(values)));
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
                if (item.type === "number") {
                  const value: any = values[item.id] || "";

                  return (
                    <Col xs={24} sm={24} md={12} lg={6} key={index}>
                      <FormInput
                        id={item.id}
                        type="number"
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

                if (item.type === "numberRange") {
                  const minValue: any = values[item.rangeFields?.minField!] || "";
                  const maxValue: any = values[item.rangeFields?.maxField!] || "";

                  return (
                    <Col xs={24} sm={24} md={12} lg={12} key={index}>
                      <div className="flex items-center text-base font-medium text-gray-500">
                        <p>Điểm từ</p>
                        <Col xs={24} sm={24} md={12} lg={6}>
                          <FormInput
                            id={item.rangeFields?.minField!}
                            type="number"
                            placeholder="Nhập điểm..."
                            value={minValue}
                            onChange={(data) => {
                              setFieldValue(item.rangeFields?.minField!, data);
                            }}
                          />
                        </Col>
                        <p>đến</p>
                        <Col xs={24} sm={24} md={12} lg={6}>
                          <FormInput
                            id={item.rangeFields?.maxField!}
                            type="number"
                            placeholder="Nhập điểm..."
                            value={maxValue}
                            onChange={(data) => {
                              setFieldValue(item.rangeFields?.maxField!, data);
                            }}
                          />
                        </Col>
                      </div>
                    </Col>
                  );
                }

                if (item.type === "select") {
                  const options = item.parentItem ? (values[item.parentItem] ? item.options : []) : item.options;
                  const newValue = Object.keys(values).reduce((acc, key) => {
                    if (key.startsWith(item.id)) {
                      // @ts-ignore
                      if (!acc[item.id]) acc[item.id] = [];
                      if (Array.isArray(values[key])) {
                        // @ts-ignore
                        acc[item.id].push(...values[key]);
                      } else {
                        // @ts-ignore
                        acc[item.id].push(values[key]);
                      }
                    }
                    return acc;
                  }, {});

                  // @ts-ignore
                  const value: any = item.isMultiple && newValue[item.id]?.length ? newValue[item.id] : values[item.id] ?? undefined;

                  return (
                    <Col key={index} xs={24} sm={24} md={12} lg={6}>
                      <FormSelect
                        id={item.id}
                        label={item.label}
                        isMultiple={item.isMultiple}
                        placeholder={item.placeholder}
                        options={options!}
                        value={value}
                        onChange={(data) => {
                          setFieldValue(item.id, data);
                          item.onChange && item.onChange(Array.isArray(data) ? data.map(String) : String(data)); //+
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
              <Button
                text={"Tìm kiếm"}
                kind="submit"
                onClick={() => {
                  handleSubmit(); // Gọi submit form
                  message.success("Tìm kiếm thành công", 1);
                }}
              />
              <Button
                type="secondary"
                text={"Hủy"}
                onClick={() => {
                  const resetFilter: ISearchParams = {
                    page: 1,
                    size: filter.size || 10, // Preserve the current page size
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
