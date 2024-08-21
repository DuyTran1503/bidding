import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { IFieldOfActivityInitialState } from "@/services/store/field_of_activity/field_of_activity.slice";
import { createFieldOfActivity, updateFieldOfActivity } from "@/services/store/field_of_activity/field_of_activity.thunk";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Formik } from "formik";
import lodash from "lodash";
import { object, string } from "yup";

interface IFieldeOfActivityFormProps {
  formikRef?: FormikRefType<IFieldOfActivityFormInitialValues>;
  type: "create" | "update" | "delete";
  tag?: IFieldOfActivityFormInitialValues;
}

export interface IFieldOfActivityFormInitialValues {
  id: string;
  name: string;
  industry: string;
  project_scale: string;
  location: string;
  is_active: boolean;
}

const FieldOfActivityForm = ({ formikRef, type, tag }: IFieldeOfActivityFormProps) => {
  const { dispatch } = useArchive<IFieldOfActivityInitialState>("field_of_activity");

  const initialValues: IFieldOfActivityFormInitialValues = {
    id: tag?.id || "", // kieu du lieu bat buoc
    name: tag?.name || "",
    industry: tag?.industry || "",
    project_scale: tag?.project_scale || "",
    location: tag?.location || "",
    is_active: false,
  };

  const fieldofactivitySchema = object().shape({
    name: string().required("Vui lòng nhập tên"),
    industry: string().required("Vui lòng nhập nghành công nghiệp"),
    project_scale: string().required("Vui lòng nhập quy mô dự án"),
    location: string().required("Vui lòng nhập vị trí địa lý"),
  });
  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={fieldofactivitySchema}
      onSubmit={(data) => {
        if (type === "create") {
          dispatch(createFieldOfActivity({ body: lodash.omit(data, "id") }));
        } else if (type === "update" && tag?.id) {
          dispatch(updateFieldOfActivity({ body: lodash.omit(data, "id"), param: tag.id }));
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
          <FormInput
            label="Loại nguồn tài trợ"
            placeholder="Nhập loại nguồn tài trợ ở đây..."
            name="project_scale"
            value={values.project_scale}
            error={touched.project_scale ? errors.project_scale : ""}
            onChange={(e) => setFieldValue("project_scale", e)}
            onBlur={handleBlur}
          />
          <FormInput
            label="Loại nguồn tài trợ"
            placeholder="Nhập loại nguồn tài trợ ở đây..."
            name="industry"
            value={values.industry}
            error={touched.industry ? errors.industry : ""}
            onChange={(e) => setFieldValue("industry", e)}
            onBlur={handleBlur}
          />
          <FormInput
            label="Loại nguồn tài trợ"
            placeholder="Nhập loại nguồn tài trợ ở đây..."
            name="location"
            value={values.location}
            error={touched.location ? errors.location : ""}
            onChange={(e) => setFieldValue("location", e)}
            onBlur={handleBlur}
          />
          {/* <FormInput
            label="Loại nguồn tài trợ"
            placeholder="Nhập loại nguồn tài trợ ở đây..."
            name="type"
            value={values.type}
            error={touched.type ? errors.type : ""}
            onChange={(e) => setFieldValue("type", e)}
            onBlur={handleBlur}
          /> */}
        </FormGroup>
      )}
    </Formik>
  );
};

export default FieldOfActivityForm;
