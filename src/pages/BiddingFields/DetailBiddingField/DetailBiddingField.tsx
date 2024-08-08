import React from 'react';
import { ITableData } from "@/components/table/PrimaryTable";
interface BiddingFieldDetailProps {
  record: ITableData;
}

const BiddingFieldDetail: React.FC<BiddingFieldDetailProps> = ({ record }) => {
  return (
    <div className="p-6 bg-white">
      <h2 className="text-3xl font-semibold mb-4">Chi tiết lĩnh vực đấu thầu</h2>
      <div className="space-y-6 text-base">
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Tên của lĩnh vực đấu thầu:</span>
          <span className="ml-2 text-gray-900">{record.name}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Mô tả của lĩnh vực đấu thầu:</span>
          <span className="ml-2 text-gray-900">{record.description}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Trạng thái:</span>
          <span className="ml-2 text-gray-900">{record.is_active ? "Đang hoạt động" : "Không hoạt động"}</span>
        </div>
      </div>
    </div>
  );
};

export default BiddingFieldDetail;
