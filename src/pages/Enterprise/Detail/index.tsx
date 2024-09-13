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

const DetailEnterprise = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IEnterpriseInitialValues>>(null);
  const { id } = useParams();

  const { state, dispatch } = useArchive<IEnterpriseInitialState>("enterprise");
  const [data, setData] = useState<IEnterpriseInitialValues>();
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
          industry_id: data?.industry_id ?? [],
          establish_date: data?.establish_date ?? "",
          organization_type: Number(data?.organization_type) ?? "",
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

export default DetailEnterprise;
