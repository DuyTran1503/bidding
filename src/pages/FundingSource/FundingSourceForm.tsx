import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { IFundingSourceInitialState } from "@/services/store/funding_source/funding_source.slice";
import { createFundingSource, updateFundingSource } from "@/services/store/funding_source/funding_source.thunk";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Formik } from "formik";
import { object, string } from "yup";
import lodash from "lodash";

interface IFundingSourceFormProps {
    formikRef?: FormikRefType<IFundingSourceFormInitialValues>;
    type: "create" | "update"  | "delete";
    tag?: IFundingSourceFormInitialValues
}

export interface IFundingSourceFormInitialValues {
    id: string ;
    name: string;
    type: string;
}

const FundingSourceForm = ({ formikRef, type, tag }: IFundingSourceFormProps ) => {
    const { dispatch } = useArchive<IFundingSourceInitialState>("fundingsource");

    const initialValues: IFundingSourceFormInitialValues = {
        id: tag?.id || "", // kieu du lieu bat buoc
        name: tag?.name || "",
        type: tag?.type || "",
    };
    
    const fundingsourceSchema = object().shape({
        name: string().required("Vui lòng nhập tên"),
        type: string().required("Vui lòng không để trống"),
         
    }) 

    return (
        <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={fundingsourceSchema}
        onSubmit={(data) => {
          if (type === "create") {
            dispatch(createFundingSource({ body: lodash.omit(data, "id") }));
          } else if (type === "update" && tag?.id) {
            dispatch(updateFundingSource({ body: lodash.omit(data, "id"), param: tag.id }));
          }
        }}
      >
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
            <FormGroup title="General information">
              <FormInput
                label="Tên nguồn tài trợ"
                placeholder="Nhập tên nguồn tài trợ ở đây..."
                name="name"
                value={values.name}
                error={touched.name ? errors.name : ""}
                onChange={(e) => setFieldValue("name", e)}
                onBlur={handleBlur}
              />
              {/* <FormInput
                label="Funding Source description"
                placeholder="Type description funding source here..."
                name="description"
                value={values.description}
                error={touched.description ? errors.description : ""}
                onChange={(e) => setFieldValue("description", e)}
                onBlur={handleBlur}
              /> */}
              {/* <FormInput
                label="Funding Source code"
                placeholder="Type code funding source here..."
                name="code"
                value={values.code}
                error={touched.code ? errors.code : ""}
                onChange={(e) => setFieldValue("code", e)}
                onBlur={handleBlur}
              /> */}
              <FormInput
                label="Loại nguồn tài trợ"
                placeholder="Nhập loại nguồn tài trợ ở đây..."
                name="type"
                value={values.type}
                error={touched.type ? errors.type : ""}
                onChange={(e) => setFieldValue("type", e)}
                onBlur={handleBlur}
              />
              {/* <FormInput
                label="Funding Source active"
                placeholder="active active funding source here..."
                name="active"
                value={values.is_active ? "true" : "false"} // Chuyển đổi boolean thành chuỗi
                error={touched.is_active ? errors.is_active : ""}
                onChange={(e) => setFieldValue("is_active", e.target.value === "true")}
                onBlur={handleBlur}
              /> */}

            </FormGroup>
        )}
      </Formik>
    );
};

export default FundingSourceForm;