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
const UpdateIndustry = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IndustryInitialValues>>(null);
  const { state, dispatch } = useArchive<IIndustryInitialState>("industry");
  const [data, setData] = useState<IIndustryInitialState>();
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
      dispatch(getBusinessActivityById(id));
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
      <IndustryForm type={EPageTypes.UPDATE} formikRef={formikRef} industry={data} />
    </>
  );
};

export default UpdateIndustry;