import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import BidDocumentForm, { IBidDocumentInitialValues } from "../ActionModule";
import { IBidDocumentInitialState, resetStatus } from "@/services/store/bid_document/bid_document.slice";

interface IProps {
  project_id?: number;
  isCreateFromProject?: boolean;
}
const CreateBidDocument: React.FC<IProps> = ({ project_id, isCreateFromProject }) => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBidDocumentInitialValues>>(null);
  const { state } = useArchive<IBidDocumentInitialState>("bid_document");

  useFetchStatus({
    module: "bid_document",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: isCreateFromProject ? undefined : "/bid-document",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <div className={`${isCreateFromProject ? "flex flex-col gap-3" : "flex flex-col gap-3"}`}>
      <Heading
        title="Tạo mới "
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/bid-document");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Tạo mới",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              if (formikRef.current) {
                formikRef.current.handleSubmit();
              }
            },
          },
        ]}
      />
      <BidDocumentForm type={EPageTypes.CREATE} isCreateFromProject={isCreateFromProject} formikRef={formikRef} project_id={project_id} />
    </div>
  );
};

export default CreateBidDocument;
