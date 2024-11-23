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
const Children = ActionModule;
const CreateProject = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<INewProject>>(null);
  const { state } = useArchive<IProjectInitialState>("project");
  const [isCreatePackageVisible, setCreatePackageVisible] = useState(false);
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
  const handleCreatePackage = () => {
    setCreatePackageVisible(true);
  };
  const handleAddChild = (newChild: INewProject) => {
    if (formikRef.current) {
      const currentValues = formikRef.current.values;
      formikRef.current.setFieldValue("children", [...(currentValues.children as any), newChild]);
    }
  };
  const onSaveChildren = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
      toast.success("Tạo mới gói thầu của dự án thành công");
      setCreatePackageVisible(false);
    }
  };
  useEffect(() => {
    return () => {
      clearChildrenState();
    };
  }, []);
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
            type: "primary",
            text: "Tạo gói thầu",
            icon: <FaPlus className="text-[18px]" />,
            onClick: handleCreatePackage,
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
      <ChildrenProject
        formikRef={formikRef} // Pass formikRef as prop
        onSave={handleAddChild}
        title="Tạo gói thầu cho dự án"
        visible={isCreatePackageVisible}
        setVisible={setCreatePackageVisible}
        footerContent={
          <div className="flex items-center justify-center gap-2">
            <Button key="cancel" text="Hủy" type="secondary" onClick={() => setCreatePackageVisible(false)} />
            <Button key="submit" kind="submit" text="Lưu" onClick={onSaveChildren} />
          </div>
        }
        type={EPageTypes.CREATE}
      >
        <Children formikRef={formikRef} isChildren type={EPageTypes.CREATE} />
      </ChildrenProject>
    </>
  );
};

export default CreateProject;
