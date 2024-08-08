import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import EnterpriseForm, { IEnterpriseInitialValues } from "../ActionModule";
import { IEnterpriseInitialState, resetStatus } from "@/services/store/enterprise/enterprise.slice";
import { getEnterpriseById } from "@/services/store/enterprise/enterprise.thunk";
const UpdateEnterprise = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IEnterpriseInitialValues>>(null);
  const { state, dispatch } = useArchive<IEnterpriseInitialState>("enterprise");
  const [data, setData] = useState<IEnterpriseInitialValues>();
  const { id } = useParams();

  useFetchStatus({
    module: "enterprise",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/enterprise",
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
        title="Cập nhật  doanh nghiệp"
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
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Cập nhật",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              if (formikRef.current) {
                formikRef.current.handleSubmit();
              }
            },
          },
        ]}
      />
      <EnterpriseForm type={EPageTypes.UPDATE} formikRef={formikRef} enterprise={data} />
    </>
  );
};

export default UpdateEnterprise;
