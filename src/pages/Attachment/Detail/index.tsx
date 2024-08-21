import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IAttachmentInitialValues } from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import AttachmentForm from "../ActionModule";
import { useArchive } from "@/hooks/useArchive";
import { IAttachmentInitialState, resetStatus } from "@/services/store/attachment/attachment.slice";
import { getAttachmentById } from "@/services/store/attachment/attachment.thunk";

const DetailAttachment = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IAttachmentInitialValues>>(null);
  const { id } = useParams();

  const { state, dispatch } = useArchive<IAttachmentInitialState>("attachment");
  const [data, setData] = useState<IAttachmentInitialValues>();
  useFetchStatus({
    module: "attachment",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/attachment",
      },
      error: {
        message: state.message,
      },
    },
  });
  useEffect(() => {
    if (id) {
      dispatch(getAttachmentById(id));
    }
  }, [id]);
  useEffect(() => {
    if (!!state.attachment) {
      setData(state.attachment);
    }
  }, [JSON.stringify(state.attachment)]);
  useEffect(() => {
    if (data) {
      if (formikRef.current) {
        formikRef.current.setValues({
          name: data.name,
          user_id: data?.user_id ?? "",
          project_id: data?.project_id ?? "",
          file: data?.file ?? "",
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
              navigate("/attachment");
            },
          },
        ]}
      />
      <AttachmentForm type={EPageTypes.VIEW} formikRef={formikRef} attachment={data} />
    </>
  );
};

export default DetailAttachment;
