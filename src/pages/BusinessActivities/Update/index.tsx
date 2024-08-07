import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import BusinessActivityForm, { IIBusinessActivityInitialValues } from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import { getBusinessActivityById } from "@/services/store/business-activity/business-activity.thunk";
import { IBusinessActivityInitialState, resetStatus } from "@/services/store/business-activity/business-activity.slice";
const UpdateBusinessActivity = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IIBusinessActivityInitialValues>>(null);
  const { state, dispatch } = useArchive<IBusinessActivityInitialState>("business");
  const [data, setData] = useState<IIBusinessActivityInitialValues>();
  const { id } = useParams();

  useFetchStatus({
    module: "business",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/business_activity",
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
        title="Cập nhật loại hình doanh nghiệp"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/business_activity");
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
      <BusinessActivityForm type={EPageTypes.UPDATE} formikRef={formikRef} businessActivity={data} />
    </>
  );
};

export default UpdateBusinessActivity;
