import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import ProjectDetailsCard from "@/pages/Project/Detail/ProjectDetailsCard";
import { IAttachment } from "@/services/store/attachment/attachment.model";
import { IAttachmentInitialState } from "@/services/store/attachment/attachment.slice";
import { getAttachmentById } from "@/services/store/attachment/attachment.thunk";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

const DetailAttachment = () => {
  const { id } = useParams();
  const { state, dispatch } = useArchive<IAttachmentInitialState>("attachment");
  const [data, setData] = useState<IAttachment>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!!state.activeAttachment) {
      setData(state.attachment);
    }
  }, [JSON.stringify(state.activeAttachment)]);
  useEffect(() => {
    if (id) {
      dispatch(getAttachmentById(id));
    }
  }, [id]);
  const labels = [
    { label: "Tên file", value: data?.name },
    {
      label: "Tên dự án", value: (
        <Tooltip title={"Chi tiết dự án"} color={"#108ee9"}>
          <span onClick={() => handleRedirectProject(data?.project?.id as number)} className="cursor-pointer text-blue-600 hover:underline">
            {data?.project?.name}
          </span>
        </Tooltip>
      ),
    },
  ];
  const handleRedirectProject = (id: string | number) => {
    navigate(`/project/detail/${id}`, { replace: true });
  };
  return (
    <>
      <Heading
        title="Chi tiết kết quả đấu thầu "
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Quay lại",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate(-1);
            },
          },
        ]}
      />
      <ProjectDetailsCard dataAttack={data} customDetails={labels} showDefaultDetails={false} title={"Thông tin kết quả đấu thầu"} />;
    </>
  );
};

export default DetailAttachment;
