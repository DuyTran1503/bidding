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
import { getTenderNoticeById } from "@/services/store/tenderNotice/tenderNotice.thunk";
import { ITenderNoticeInitialState, resetStatus } from "@/services/store/tenderNotice/tenderNotice.slice";
import TenderNoticeForm, { ITenderNoticeFormInitialValues } from "../TenderNoticeForm";

const UpdateTenderNotice = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<ITenderNoticeFormInitialValues>>(null);
  const { state, dispatch } = useArchive<ITenderNoticeInitialState>("tender_notice");
  const [data, setData] = useState<ITenderNoticeFormInitialValues>();
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

  useEffect(() => {
    if (!!state.activeTenderNotice) {
      setData(state.activeTenderNotice);
    }
  }, [JSON.stringify(state.tenderNotice)]);

  useEffect(() => {
    if (data) {
      if (formikRef.current) {
        formikRef.current.setValues({
          project_id: data.project_id,
          enterprise_id: data.enterprise_id,
          notice_content: data.notice_content,
          notice_date: data.notice_date,
          expiry_date: data.expiry_date,
          is_active: data.is_active
        });
      }
    }
  }, [data]);

  return (
    <>
      <Heading
        title="Cập nhật thông báo mời thầu"
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
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Cập nhật",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => formikRef.current?.handleSubmit(),
          },
        ]}
      />
      {state.activeTenderNotice ? (
        <TenderNoticeForm type={EPageTypes.UPDATE} formikRef={formikRef} tenderNotice={state.activeTenderNotice} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default UpdateTenderNotice;
