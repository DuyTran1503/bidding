import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect"; // Import FormSelect
import UpdateGrid from "@/components/grid/UpdateGrid";
import { Formik } from "formik";
import { object, string, number } from "yup";
import { useEffect, useState } from "react";
import { FormikRefType } from "@/shared/utils/shared-types";
import lodash from "lodash";
import { IBiddingType } from "@/services/store/biddingtype/biddingType.model";
import { IBiddingTypeInitialState } from "@/services/store/biddingtype/biddingType.slice";

interface IActiveBiddingType extends Omit<IBiddingType, "parent"> {
    parent: string[];
}

interface IBiddingTypeFormProps {
    formikRef?: FormikRefType<IBiddingTypeFormInitialValues>;
    type: "create" | "view" | "update";
    biddingType?: IActiveBiddingType;
}

export interface IBiddingTypeFormInitialValues {
    name: string;
    description: string;
    code: number;
    is_active: string;
    parent_id: string;
}

const BiddingTypeForm = ({ formikRef, type, biddingType }: IBiddingTypeFormProps) => {
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const { dispatch, state } = useArchive<IBiddingTypeInitialState>("biddingtype");
    const initialValues: IBiddingTypeFormInitialValues = {
        name: "",
        description: "",
        code: 0,
        is_active: "0",
        parent_id: "",
    };

    const validationSchema = object().shape({
        name: string().required("Vui lòng nhập tên trường đấu giá"),
        description: string().required("Vui lòng nhập mô tả trường đấu giá"),
        code: number().required("Vui lòng nhập mã"),
    });

    useEffect(() => {
        const options = state.biddingTypes.map(field => ({
            value: field.id.toString(),
            label: field.name
        }));
        setOptions(options);
    }, [state.biddingTypes]);

    useEffect(() => {
        setLoading(false);
    }, []);

    const isActiveOptions = [
        { value: '0', label: 'Không' },
        { value: '1', label: 'Có' },
    ];

    return (
        <Formik
            innerRef={formikRef}
            initialValues={biddingType ?? initialValues}
            validationSchema={validationSchema}
            onSubmit={(data) => {
                const body = {
                    ...lodash.omit(data, "id"),
                    parent: data.parent_id ? [data.parent_id] : [],
                };
                if (type === "create") {
                    dispatch(createBiddingType({ body }));
                } else if (type === "update") {
                    dispatch(updateBiddingType({ body, param: biddingType?.id }));
                }
            }}
        >
            {({ values, errors, touched, handleBlur, setFieldValue }) => {
                return (
                    <UpdateGrid
                        colNumber="2"
                        rate="1-3"
                        isLoading={loading}
                        groups={{
                            colFull: (
                                <FormGroup title="General Information">
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        label="Tên của lĩnh vực đấu thầu"
                                        value={values.name}
                                        name="name"
                                        error={touched.name ? errors.name : ""}
                                        placeholder="Nhập tên của lĩnh vực đấu thầu..."
                                        onChange={(value) => {
                                            setFieldValue("name", value);
                                        }}
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
                                        onChange={(value) => {
                                            setFieldValue("description", value);
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    <FormInput
                                        type="number"
                                        isDisabled={type === "view"}
                                        label="Mã duy nhất cho  lĩnh vực đấu thầu"
                                        value={values.code}
                                        name="code"
                                        onChange={(value) => {
                                            setFieldValue("code", value);
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    <FormSelect
                                        label="Chỉ ra nguồn vốn đang hoạt động hay không"
                                        isDisabled={type === "view"}
                                        placeholder="Select active status"
                                        options={isActiveOptions}
                                        defaultValue={values.is_active}
                                        onChange={(value) => {
                                            setFieldValue("is_active", value as string);
                                        }}
                                    />
                                    <FormSelect
                                        label="ID của lĩnh vực cha"
                                        isDisabled={type === "view"}
                                        placeholder="Chọn lĩnh vực cha"
                                        options={options}
                                        defaultValue={values.parent_id}
                                        onChange={(value) => {
                                            setFieldValue("parent_id", value as string);
                                        }}
                                    />
                                </FormGroup>
                            ),
                        }}
                    />
                );
            }}
        </Formik>
    );
};

export default BiddingTypeForm;
