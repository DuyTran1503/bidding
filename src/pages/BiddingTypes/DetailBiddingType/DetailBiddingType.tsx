import React from "react";
import { ITableData } from "@/components/table/PrimaryTable"; // Ensure this path is correct

interface IDetailBiddingType {
  record: ITableData; // record is of type ITableData
}

const DetailBiddingType: React.FC<IDetailBiddingType> = ({ record }: any) => {
  return (
    <div className="bg-white p-4">
      <h2 className="mb-4 text-3xl font-semibold">Thông tin lĩnh vực đấu thầu</h2>
      <div className="text-m-medium space-y-4">
        <div className="flex items-start">
          <span className="text-gray-700 w-2/5 font-semibold">Tên của lĩnh vực đấu thầu:</span>
          <span className="text-gray-900 ml-2">{record.name}</span>
        </div>
        <div className="flex items-start">
          <span className="text-gray-700 w-2/5 font-semibold">Mô tả của lĩnh vực đấu thầu:</span>
          <span className="text-gray-900 ml-2">{record.description}</span>
        </div>
        <div className="flex items-start">
          <span className="text-gray-700 w-2/5 font-semibold">Trạng thái:</span>
          <span className="text-gray-900 ml-2">{record.is_active ? "Kích hoạt" : "Không kích hoạt"}</span>
        </div>
        <div className="flex items-start">
          <span className="text-gray-700 w-2/5 font-semibold">Lĩnh vực cha:</span>
          <span className="text-gray-900 ml-2">{record.parent_name || "Không có"}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailBiddingType;
