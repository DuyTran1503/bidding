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
import { useEffect, useRef, useState } from "react";
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
          name: data?.name ?? "",
          address: data?.address ?? "",
          description: data?.description ?? "",
          representative: data?.representative ?? "",
          phone: data?.phone ?? "",
          email: data?.email ?? "",
          avatar: data?.avatar ?? "",
          taxcode: data?.taxcode ?? "",
          account_ban_at: data?.account_ban_at ?? null,
          website: data?.website ?? "",
          industries: data?.industries ?? [],
          establish_date: data?.establish_date ?? "",
          organization_type: data?.organization_type ?? "",
          avg_document_rating: data?.avg_document_rating ?? "",
          registration_date: data?.registration_date ?? "",
          registration_number: data?.registration_number ?? "",
          is_active: data?.is_active ?? false,
          is_blacklist: data?.is_blacklist ?? false,
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
