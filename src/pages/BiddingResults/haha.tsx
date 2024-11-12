import { useArchive } from "@/hooks/useArchive";
import { Table } from "antd";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useViewport } from "@/hooks/useViewport";
import { IBiddingResult } from "@/services/store/biddingResult/biddingResult.model";
import { IBiddingResultInitialState } from "@/services/store/biddingResult/biddingResult.slice";
import { getBiddingResultById } from "@/services/store/biddingResult/biddingResult.thunk";
import { useParams } from "react-router-dom";

interface IBiddingResultFormProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const BiddingResultForm = ({ visible, setVisible }: IBiddingResultFormProps) => {
  const [biddingResult, setBiddingResult] = useState<IBiddingResult | null>(null);
  const { dispatch } = useArchive<IBiddingResultInitialState>("bidding_result");
  const { screenSize } = useViewport();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getBiddingResultById(id)).then((result: any) => {
        setBiddingResult(result.payload); // Lưu dữ liệu vào state khi API trả về kết quả
      });
    }
  }, [id, dispatch]);

  // Chuẩn bị dữ liệu cho bảng
  const tableData = biddingResult
    ? [
      { key: "1", label: "ID", value: biddingResult.id },
      { key: "2", label: "Enterprise Representative", value: biddingResult.enterprise.representative },
      { key: "3", label: "Enterprise Phone", value: biddingResult.enterprise.phone },
      { key: "4", label: "Enterprise Address", value: biddingResult.enterprise.address },
      { key: "5", label: "Project Name", value: biddingResult.project.name },
      { key: "6", label: "Project Location", value: biddingResult.project.location },
      { key: "7", label: "Bid Submission Start", value: biddingResult.project.bid_submission_start },
      { key: "8", label: "Bid Submission End", value: biddingResult.project.bid_submission_end },
      { key: "9", label: "Bid Document Submission Date", value: biddingResult.bid_document.submission_date },
      { key: "10", label: "Bid Document Price", value: biddingResult.bid_document.bid_price },
      { key: "11", label: "Win Amount", value: biddingResult.win_amount },
      { key: "12", label: "Decision Number", value: biddingResult.decision_number },
      { key: "13", label: "Decision Date", value: biddingResult.decision_date },
    ]
    : [];

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <Dialog screenSize={screenSize} visible={visible} setVisible={setVisible}>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false} // Tắt phân trang vì chỉ có một bản ghi
        rowKey="key" // Khóa duy nhất cho mỗi hàng
      />
    </Dialog>
  );
};

export default BiddingResultForm;
