import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { INewProject } from "@/services/store/project/project.model";
import { IProjectInitialState, resetStatus } from "@/services/store/project/project.slice";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ActionModule from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import ChildrenProject from "../ChildrenProject";
import Button from "@/components/common/Button";
import toast from "react-hot-toast";
import { clearChildrenState } from "@/shared/utils/localStorage";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const CreateProject = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<INewProject>>(null);
  const { state } = useArchive<IProjectInitialState>("project");
  useFetchStatus({
    module: "project",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        // navigate: "/project",
      },
      error: {
        message: state.message,
      },
    },
  });
  useEffect(() => {
    return () => {
      clearChildrenState();
    };
  }, []);
  console.log(state.dataCreateProject);

  const tabItems = [
    {
      key: "1",
      label: "Tạo mới dự án",
      children: (
        <div>
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
          <ActionModule type={EPageTypes.CREATE} formikRef={formikRef} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Tạo gói thầu cho dự án",
      disabled: !state.dataCreateProject?.id,
      children: (
        <div>
          <Heading
            title="Tạo mới thầu cho dự án"
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
          <ActionModule type={EPageTypes.UPDATE} project={state.dataCreateProject} isChildren formikRef={formikRef} />
        </div>
      ),
    },
    {
      key: "3",
      label: "Hồ sơ đấu thầu",
      disabled: !state.dataCreateProject?.id,
      children: <div>Hồ sơ đấu thầu</div>,
    },
    {
      key: "4",
      label: "Bão lãnh dự thầu",
      disabled: !state.dataCreateProject?.id,
      children: <div>Outgoing email settings content goes here</div>,
    },
  ];

  return <Tabs items={tabItems} />;
};

export default CreateProject;
