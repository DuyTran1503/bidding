import Heading from "@/components/layout/Heading";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useArchive } from "@/hooks/useArchive";
import { useEffect } from "react";
import { ISupportInitialState } from "@/services/store/support/support.slice";
import { getSupportById } from "@/services/store/support/support.thunk";
import SupportForm from "../SupportForm";
import { EPageTypes } from "@/shared/enums/page";

const DetailSupport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<ISupportInitialState>("support");

  useEffect(() => {
    if (id) dispatch(getSupportById(id));
  }, [id]);

  return (
    <>
      <Heading
        title="Chi tiết "
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/supports");
            },
          },
        ]}
      />

      {state.activeSupport && (
        <SupportForm
          type={EPageTypes.VIEW}
          support={{
            ...state.activeSupport,
          }} />
      )}
    </>
  );
};

export default DetailSupport;
