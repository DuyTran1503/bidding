import React from "react";
import { ITableData } from "@/components/table/PrimaryTable";

interface DetailSelectionMethodProps {
  record: ITableData;
}

const DetailSelectionMethod: React.FC<DetailSelectionMethodProps> = ({ record }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Chi tiết hình thức đấu thầu</h2>
      <div className="space-y-4">
        <div className="flex items-start">
          <span className="font-medium text-gray-700 w-1/3">Tên của hình thức đấu thầu:</span>
          <span className="ml-2 text-gray-900">{record.method_name as string}</span>
        </div>
        <div className="flex items-start">
          <span className="font-medium text-gray-700 w-1/3">Mô tả của hình thức đấu thầu:</span>
          <span className="ml-2 text-gray-900">{record.description as string}</span>
        </div>
        <div className="flex items-start">
          <span className="font-medium text-gray-700 w-1/3">Trạng thái:</span>
          <span className="ml-2 text-gray-900">{record.is_active ? "Kích hoạt" : "Không kích hoạt"}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailSelectionMethod;
