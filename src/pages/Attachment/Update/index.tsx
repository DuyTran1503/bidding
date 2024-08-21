import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import AttachmentForm, { IAttachmentInitialValues } from "../ActionModule";
import { useEffect, useRef, useState } from "react";
import { IAttachmentInitialState, resetStatus } from "@/services/store/attachment/attachment.slice";
import { getAttachmentById } from "@/services/store/attachment/attachment.thunk";
const UpdateAttachment = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IAttachmentInitialValues>>(null);
  const { state, dispatch } = useArchive<IAttachmentInitialState>("attachment");
  const [data, setData] = useState<IAttachmentInitialValues>();
  const { id } = useParams();

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
        title="Cập nhật tài liệu đính kèm"
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
      <AttachmentForm type={EPageTypes.UPDATE} formikRef={formikRef} attachment={data} />
    </>
  );
};

export default UpdateAttachment;
