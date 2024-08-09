import React from 'react';
import { ITableData } from "@/components/table/PrimaryTable";
interface DetailRoleProps {
  record: ITableData;
}

const DetailRole: React.FC<DetailRoleProps> = ({ record }: ITableData | any) => {
  return (
    <div className="p-6 bg-white">
      <h2 className="text-3xl font-semibold mb-4">Chi tiết vai trò</h2>
      <div className="space-y-6 text-base">
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Tên của vai trò:</span>
          <span className="ml-2 text-gray-900">{record.name}</span>
        </div>
        {/* <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Mô tả của vai trò:</span>
          <span className="ml-2 text-gray-900">{record.description}</span>
        </div> */}
      </div>
    </div>
  );
};

export default DetailRole;
