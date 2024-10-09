import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { getTenderNoticeById } from "@/services/store/tenderNotice/tenderNotice.thunk";
import { ITenderNoticeInitialState, resetStatus } from "@/services/store/tenderNotice/tenderNotice.slice";
import TenderNoticeForm, { ITenderNoticeFormInitialValues } from "../TenderNoticeForm";

const DetailTenderNotice = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<ITenderNoticeFormInitialValues>>(null);
  const { state, dispatch } = useArchive<ITenderNoticeInitialState>("tender_notice");
  const { id } = useParams();

  useFetchStatus({
    module: "tender_notice",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/tender-notices",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getTenderNoticeById(id));
    }
  }, [id]);

  return (
    <>
      <Heading
        title="Chi tiết lịch sử đấu thầu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/tender-notices");
            },
          },
        ]}
      />
      {state.activeTenderNotice ? (
        <TenderNoticeForm type={EPageTypes.VIEW} formikRef={formikRef} tenderNotice={state.activeTenderNotice} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default DetailTenderNotice;
