import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import ProjectDetailsCard, { getFileIcon } from "@/pages/Project/Detail/ProjectDetailsCard";
import { IBiddingResult } from "@/services/store/biddingResult/biddingResult.model";
import { IBiddingResultInitialState } from "@/services/store/biddingResult/biddingResult.slice";
import { getBiddingResultById } from "@/services/store/biddingResult/biddingResult.thunk";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

const DetailBiddingResult = () => {
  const { id } = useParams();
  const { state, dispatch } = useArchive<IBiddingResultInitialState>("bidding_result");
  const [data, setData] = useState<IBiddingResult>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!!state.activeBiddingResult) {
      setData(state.activeBiddingResult);
    }
  }, [JSON.stringify(state.activeBiddingResult)]);
  useEffect(() => {
    if (id) {
      dispatch(getBiddingResultById(id));
    }
  }, [id]);
  const labels = [
    { label: "Tên dự án", value: data?.project?.name },
    {
      label: "Tên doanh nghiệp trúng thầu",
      value: (
        <Tooltip title={"Chi tiết doanh nghiệp"} color={"#108ee9"}>
          <span onClick={() => handleRedirect(data?.enterprise.id as number)} className="cursor-pointer text-blue-600 hover:underline">
            {data?.enterprise.user?.name}
          </span>
        </Tooltip>
      ),
    },
    { label: "Email doanh nghiệp trúng thầu", value: data?.enterprise.user?.email },
    { label: "Mã số thuế doanh nghiệp trúng thầu", value: data?.enterprise.user?.taxcode },
    { label: "Số điện thoại doanh nghiệp trúng thầu", value: data?.enterprise.phone },
    { label: "Địa chỉ doanh nghiệp trúng thầu", value: data?.enterprise.address },
    { label: "Số quyết đinh", value: data?.decision_number },
    { label: "Ngày quyết đinh", value: data?.decision_date },
    { label: "Số tiền trúng thầu", value: convertMoney(data?.win_amount as string) },
    {
      label: "Hồ sơ trúng thầu",
      value: (
        <div className="flex flex-wrap items-center gap-4">
          {data && data.bid_document && data.bid_document.file ? (
            <Tooltip title={"Hồ sơ trúng thầu"} color={"#108ee9"}>
              {/* <a href={data.bid_document.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    {file.type && getFileIcon(file.type) && <img src={getFileIcon(file.type)} alt={file.type} className="h-6 w-6 object-contain" />}
                  </a> */}
            </Tooltip>
          ) : (
            <span>Không có tệp đính kèm</span>
          )}
        </div>
      ),
    },
  ];
  const handleRedirect = (id: string | number) => {
    navigate(`/enterprise/detail/${id}`, { replace: true });
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
              navigate("/bidding-results");
            },
          },
        ]}
      />
      <ProjectDetailsCard data2={data} customDetails={labels} showDefaultDetails={false} title={"Thông tin kết quả đấu thầu"} />;
    </>
  );
};

export default DetailBiddingResult;
