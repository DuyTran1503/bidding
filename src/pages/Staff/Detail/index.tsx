import Heading from "@/components/layout/Heading";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useArchive } from "@/hooks/useArchive";
import { getRoleById } from "@/services/store/role/role.thunk";
import { useEffect } from "react";
import { EPageTypes } from "@/shared/enums/page";
import ActionModule from "../ActionModule";
import { IAccountInitialState } from "@/services/store/account/account.slice";

const DetailStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IAccountInitialState>("account");

  useEffect(() => {
    if (id) dispatch(getRoleById(id));
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
              navigate("/staffs");
            },
          },
        ]}
      />

      {state.staff && (
        <ActionModule
          type={EPageTypes.VIEW}
          account={{
            ...state.staff,
            id_role: state.staff.list_role.map((item: any) => item.id),
          }}
        />
      )}
    </>
  );
};

export default DetailStaff;
