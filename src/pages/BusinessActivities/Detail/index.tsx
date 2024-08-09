import React from 'react';
import { ITableData } from "@/components/table/PrimaryTable";
interface DetailBusinessActivityProps {
  record: ITableData;
}

const DetailBusinessActivity: React.FC<DetailBusinessActivityProps> = ({ record }: ITableData | any) => {
  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-4">Chi tiết loại hình doanh nghiệp</h2>
      <div className="space-y-6 text-base">
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Tên loại hình doanh nghiệp:</span>
          <span className="ml-2 text-gray-900">{record.name}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Mô tả của loại hình doanh nghiệp:</span>
          <span className="ml-2 text-gray-900">{record.description || "Null"}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Trạng thái:</span>
          <span className="ml-2 text-gray-900">{record.is_active ? "Đang hoạt động" : "Không hoạt động"}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailBusinessActivity;
