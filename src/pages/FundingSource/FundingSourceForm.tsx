import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { IFundingSourceInitialState } from "@/services/store/funding_source/funding_source.slice";
import { createFundingSource, updateFundingSource } from "@/services/store/funding_source/funding_source.thunk";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Formik } from "formik";
import { Form } from "react-router-dom";
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
    description: string;
    code: string;
    type: string;
    is_active: boolean;
}

const FundingSourceForm = ({ formikRef, type, tag }: IFundingSourceFormProps ) => {
    const { dispatch } = useArchive<IFundingSourceInitialState>("fundingsource");

    const initialValues: IFundingSourceFormInitialValues = {
        id: tag?.id || "", // kieu du lieu bat buoc
        name: tag?.name || "",
        description: tag?.description || "",  
        code: tag?.code || "",
        type: tag?.type || "",
        is_active: tag?.is_active ?? false, // Thay 'boolean' bằng giá trị mặc định như false
    };
    
    const fundingsourceSchema = object().shape({
        name: string().required("Please enter name"),
        description: string().required("Please enter description"),
        code: string().required("Please enter code"),
        type: string().required("Please enter type"),
         
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
          <Form>
            <FormGroup title="General information">
              <FormInput
                label="Tag name"
                placeholder="Type name tag here..."
                name="name"
                value={values.name}
                error={touched.name ? errors.name : ""}
                onChange={(e) => setFieldValue("name", e)}
                onBlur={handleBlur}
              />
              <FormInput
                label="Tag description"
                placeholder="Type description tag here..."
                name="description"
                value={values.description}
                error={touched.description ? errors.description : ""}
                onChange={(e) => setFieldValue("description", e)}
                onBlur={handleBlur}
              />
            </FormGroup>
          </Form>
        )}
      </Formik>
    );
};

export default FundingSourceForm;