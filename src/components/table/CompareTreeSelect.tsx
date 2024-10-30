import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { ISearchParams } from "@/shared/utils/shared-interfaces";
import { useDispatch } from "react-redux";
import { Formik, FormikHelpers } from "formik";
import FormTreeSelect from "../form/FormTreeSelect";
import { Col, Row } from "antd";
import Button from "../common/Button";

export interface ICompareItem {
    placeholder?: string;
    id: string;
    treeData?: { title: string; value: string; children?: any[] }[];
    label?: string;
}

export interface ICompareProps<T extends ISearchParams> {
    compare: ICompareItem[]; // Mảng các lựa chọn `treeSelect`
    setFilter: ActionCreatorWithPayload<ISearchParams>;
    filter: T;
}

const CompareTreeSelect = <T extends ISearchParams>({ compare, setFilter, filter }: ICompareProps<T>) => {
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
            {({ values, setFieldValue, handleSubmit, resetForm }) => (
                <>
                    <Row gutter={[24, 24]} className="items-center">
                        {compare.map((item, index) => (
                            <Col key={index} xs={24} sm={24} md={12} lg={6}>
                                <FormTreeSelect
                                    label={item.label}
                                    placeholder={item.placeholder}
                                    treeData={item.treeData!}
                                    value={values[item.id] as string | string[] | undefined}
                                    onChange={(data) => setFieldValue(item.id, data)}
                                />
                            </Col>
                        ))}
                    </Row>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <Button text="Tìm kiếm" onClick={() => handleSubmit()} />
                        <Button
                            type="secondary"
                            text="Hủy"
                            onClick={() => resetForm()}
                        />
                    </div>
                </>
            )}
        </Formik>
    );
};

export default CompareTreeSelect;
