import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IProject } from "@/services/store/project/project.model";
import { IProjectInitialState, resetStatus } from "@/services/store/project/project.slice";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ActionModule from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import { getProjectById } from "@/services/store/project/project.thunk";

const UpdateProject = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IProject>>(null);
  const { state, dispatch } = useArchive<IProjectInitialState>("enterprise");
  const [data, setData] = useState<IProject>();
  const { id } = useParams();
  useFetchStatus({
    module: "project",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/project",
      },
      error: {
        message: state.message,
      },
    },
  });
  useEffect(() => {
    if (id) {
      dispatch(getProjectById(id));
    }
  }, [id]);
  useEffect(() => {
    if (!!state.project) {
      setData(state.project);
    }
  }, [JSON.stringify(state.project)]);
  return (
    <>
      <Heading
        title="Tạo mới "
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/project");
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
      <ActionModule type={EPageTypes.UPDATE} formikRef={formikRef} project={data} />
    </>
  );
};

export default UpdateProject;
