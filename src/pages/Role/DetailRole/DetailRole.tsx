import Heading from "@/components/layout/Heading";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import RoleForm from "../RoleForm";
import { IRoleInitialState } from "@/services/store/role/role.slice";
import { useArchive } from "@/hooks/useArchive";
import { convertRolePermissions } from "../helpers/convertRolePermissions";
import { getRoleById } from "@/services/store/role/role.thunk";
import { useEffect } from "react";
import { EPageTypes } from "@/shared/enums/page";

const DetailRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IRoleInitialState>("role");

  useEffect(() => {
    if (id) dispatch(getRoleById(id));
  }, [id]);
  return (
    <>
      <Heading
        title="Cập nhật vai trò"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/roles");
            },
          },
        ]}
      />

      {state.activeRole && <RoleForm type={EPageTypes.UPDATE} role={convertRolePermissions(state.activeRole)} />}
    </>
  );
};

export default DetailRole;
