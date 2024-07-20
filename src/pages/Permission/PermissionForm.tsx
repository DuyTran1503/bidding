import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormSwitch from "@/components/form/FormSwitch";
import UpdateGrid from "@/components/grid/UpdateGrid";
import { useArchive } from "@/hooks/useArchive";
import { AppDispatch } from "@/services/store";
import { IPermissionInitialState } from "@/services/store/permission/permission.slice";
import { createPermission, getAllModules } from "@/services/store/permission/permission.thunk";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Formik } from "formik";
import { useEffect, useState } from "react";

interface IPermissionFormProps {
  formikRef?: FormikRefType<IPermissionFormInitialValues>;
  type: "create" | "view" | "update";
}

export interface IPermissionFormInitialValues {
  label: string;
  name: string;
  module: string;
}

const PermissionForm = ({ formikRef, type }: IPermissionFormProps) => {
  const { state, dispatch } = useArchive<IPermissionInitialState>("permission");
  const [newModule, setNewModule] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialValues: IPermissionFormInitialValues = {
    label: "",
    name: "",
    module: "",
  };

  useEffect(() => {
    dispatch(getAllModules()).then(() => setLoading(false));
  }, []);

  return (
    <>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={(data) => {
          if (type === "create") {
            dispatch(createPermission({ body: data }));
          }
        }}
      >
        {({ values, errors, touched, setFieldValue, handleBlur }) => {
          return (
            <UpdateGrid
              colNumber="2"
              rate="1-3"
              isLoading={loading}
              groups={{
                colLeft: (
                  <FormGroup title="Module">
                    <FormSwitch
                      label="New module"
                      onChange={(value) => {
                        setNewModule(value);
                        setFieldValue("module", "");
                      }}
                    />
                    {newModule ? (
                      <FormInput
                        label="Permission Module"
                        placeholder="Choose permission module..."
                        onChange={(value) => setFieldValue("module", value)}
                        value={values.module}
                      />
                    ) : (
                      <FormSelect
                        onChange={(value) => setFieldValue("module", value)}
                        options={state.modules.map((module) => ({ label: module, value: module }))}
                        label="Permission Module"
                        placeholder="Choose permission module..."
                      />
                    )}
                  </FormGroup>
                ),
                colRight: (
                  <FormGroup title="General Information">
                    <FormInput
                      value={values.label}
                      label="Permission Name"
                      error={touched.label ? errors.label : ""}
                      placeholder="Type permission name here..."
                      onBlur={handleBlur}
                      onChange={(value) => {
                        setFieldValue("label", value);
                      }}
                    />
                    <FormInput
                      value={values.name}
                      label="Permission Value"
                      error={touched.name ? errors.name : ""}
                      placeholder="Type permission value here..."
                      onBlur={handleBlur}
                      onChange={(value) => {
                        setFieldValue("name", value);
                      }}
                    />
                  </FormGroup>
                ),
              }}
            />
          );
        }}
      </Formik>
    </>
  );
};

export default PermissionForm;
