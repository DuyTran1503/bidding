import { useCallback, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { ITagInitialState, resetStatus } from "@/services/store/tag/tag.slice";
import { useArchive } from "@/hooks/useArchive";
import BusinessActivityForm, { IIBusinessActivityInitialValues } from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import { getBusinessActivityById } from "@/services/store/business-activity/business-activity.thunk";
import { IBusinessActivityInitialState } from "@/services/store/business-activity/business-activity.slice";

const index = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IIBusinessActivityInitialValues>>(null);
  const { id } = useParams();

  const { state, dispatch } = useArchive<IBusinessActivityInitialState>("business");

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
  // useEffect(() => {
  //   if (id) {
  //     dispatch(getBusinessActivityById(id));
  //   }
  // }, [id]);

  useEffect(() => {
    if (state.businessActivity) {
      if (formikRef.current) {
        formikRef.current.setValues({
          name: state.businessActivity.name,
          description: state.businessActivity.description,
          is_active: state.businessActivity.is_active,
        });
      }
    }
  }, [state.activeTag]);
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
      <BusinessActivityForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default index;
