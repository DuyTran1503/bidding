import { useArchive } from "@/hooks/useArchive";
import Heading from "@/components/layout/Heading";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FormikProps } from "formik";
import useFetchStatus from "@/hooks/useFetchStatus";
import ActionModule from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import { getEmployeeById } from "@/services/store/employee/employee.thunk";
import { IEmployee } from "@/services/store/employee/employee.model";
import { IEmployeeInitialState, resetStatus } from "@/services/store/employee/employee.slice";
const DetailEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IEmployee>>(null);
  const { state, dispatch } = useArchive<IEmployeeInitialState>("employee");

  useFetchStatus({
    module: "employee",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/employees",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) dispatch(getEmployeeById(id));
  }, [id, dispatch]);

  return (
    <>
      <Heading
        title="Chi tiết nhân viên"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/employees");
            },
          },
        ]}
      />
      {state.employee && <ActionModule type={EPageTypes.UPDATE} formikRef={formikRef} employee={state.employee} />}
    </>
  );
};

export default DetailEmployee;
