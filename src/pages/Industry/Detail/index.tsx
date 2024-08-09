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
import IndustryForm, { IndustryInitialValues } from "../ActionModule";
import { IIndustryInitialState, resetStatus } from "@/services/store/industry/industry.slice";
import { getIndustryById } from "@/services/store/industry/industry.thunk";
const DetailIndustry = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IndustryInitialValues>>(null);
  const { state, dispatch } = useArchive<IIndustryInitialState>("industry");
  const [data, setData] = useState<IndustryInitialValues>();
  const { id } = useParams();

  useFetchStatus({
    module: "industry",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/industry",
      },
      error: {
        message: state.message,
      },
    },
  });
  useEffect(() => {
    if (id) {
      dispatch(getIndustryById(id));
    }
  }, [id]);
  useEffect(() => {
    if (!!state.businessActivity) {
      setData(state.businessActivity);
    }
  }, [JSON.stringify(state.businessActivity)]);

  useEffect(() => {
    if (data) {
      if (formikRef.current) {
        formikRef.current.setValues({
          name: data.name,
          business_activity_type_id: data.business_activity_type_id,
          description: data.description,
          is_active: data.is_active,
        });
      }
    }
  }, [data]);
  return (
    <>
      <Heading
        title="Cập nhật ngành kinh doanh"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/industry");
            },
          },
        ]}
      />
      <IndustryForm type={EPageTypes.VIEW} formikRef={formikRef} industry={data} />
    </>
  );
};

export default DetailIndustry;
