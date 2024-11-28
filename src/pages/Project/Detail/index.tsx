import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { INewProject } from "@/services/store/project/project.model";
import { IProjectInitialState, resetStatus } from "@/services/store/project/project.slice";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "@/services/store/project/project.thunk";
import { Card, Descriptions, Tooltip, Typography } from "antd";
import { SUBMIT_METHOD } from "@/shared/enums/submissionMethod";
import { DOMESTIC, mappingDOMESTIC } from "@/shared/enums/domestic";
import { convertTimestamp } from "@/shared/utils/common/convertTimestamp";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { STATUS_PROJECT, STATUS_PROJECT_LABELS } from "@/shared/enums/statusProject";
import PDF from "@/assets/images/pdf.png";
import EXCEL from "@/assets/images/excel.png";
import WORD from "@/assets/images/word.jpg";
import ProjectDetailsCard from "./ProjectDetailsCard";
const DetailProject = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IProjectInitialState>("project");
  const [data, setData] = useState<INewProject>();
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
  const getSubmissionMethodLabel = (method?: string) => {
    return method ? SUBMIT_METHOD[method as keyof typeof SUBMIT_METHOD] || "Không xác định" : "Không xác định";
  };
  const getDomesticLabel = (id?: number) => {
    if (id !== undefined) {
      const domesticValue = parseInt(String(id), 10);
      return mappingDOMESTIC[domesticValue as DOMESTIC] || "Không xác định";
    }
    return "Không xác định";
  };
  const getStatusLabel = (status?: string): string => {
    if (!status) return "Không xác định";

    const statusNumber = parseInt(status, 10);
    return STATUS_PROJECT_LABELS[statusNumber as STATUS_PROJECT] || "Không xác định";
  };
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return PDF;
      case "xlsx":
      case "xls":
        return EXCEL;
      case "doc":
      case "docx":
        return WORD;
      default:
        return "📁";
    }
  };
  return (
    <>
      <Heading
        title="Chi tiết dự án"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Quay lại",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/project");
            },
          },
        ]}
      />
     <ProjectDetailsCard data={data} title={'Thông tin dự án'}/>
      {/* <ActionModule type={EPageTypes.VIEW} formikRef={formikRef} project={data} /> */}
    </>
  );
};

export default DetailProject;
