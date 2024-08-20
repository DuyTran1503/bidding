import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IEnterpriseInitialValues } from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import { IEnterpriseInitialState, resetStatus } from "@/services/store/enterprise/enterprise.slice";
import EnterpriseForm from "../ActionModule";
import { useArchive } from "@/hooks/useArchive";
import { getEnterpriseById } from "@/services/store/enterprise/enterprise.thunk";

const index = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IEnterpriseInitialValues>>(null);
  const { id } = useParams();

  const { state, dispatch } = useArchive<IEnterpriseInitialState>("enterprise");
  const [data, setData] = useState<IEnterpriseInitialValues>();
  useFetchStatus({
    module: "business",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/business-activity",
      },
      error: {
        message: state.message,
      },
    },
  });
  useEffect(() => {
    if (id) {
      dispatch(getEnterpriseById(id));
    }
  }, [id]);
  useEffect(() => {
    if (!!state.enterprise) {
      setData(state.enterprise);
    }
  }, [JSON.stringify(state.enterprise)]);
  useEffect(() => {
    if (data) {
      if (formikRef.current) {
        formikRef.current.setValues({
          name: data.name,
          address: data.address,
          representative: data.representative,
          contact_phone: data.contact_phone,
          email: data.email,
          website: data.website,
          join_date: data.join_date,
          id_business_activity: data.id_business_activity,
          description: data.description,
          tax_code: data.tax_code,
          organization_type: data.organization_type,
          representative_name: data.representative_name,
          business_registration_date: data.business_registration_date,
          business_registration_number: data.business_registration_number,
          is_active: data.is_active,
          is_blacklisted: data.is_blacklisted,
        });
      }
    }
  }, [data]);
  return (
    <>
      <Heading
        title="Cập nhật loại hình doanh nghiệp"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/enterprise");
            },
          },
        ]}
      />
      <EnterpriseForm type={EPageTypes.VIEW} formikRef={formikRef} enterprise={data} />
    </>
  );
};

export default index;
