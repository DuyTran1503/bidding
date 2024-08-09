import { ITableData } from "@/components/table/PrimaryTable";
import React from "react";

interface IDetailStaffProps {
  record: ITableData;
}

const DetailStaff: React.FC<IDetailStaffProps> = ({ record }) => {
  return (
    <div className="p-6 bg-white">
      <h2 className="text-3xl font-semibold mb-4">Chi tiết nhân viên</h2>
      <div className="space-y-4 text-base">
        <div className="flex items-center justify-center">
          <img src={record.avatar} alt="Avatar" className="ml-2 w-24 h-24 object-cover rounded-full" />
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Tên:</span>
          <span className="ml-2 text-gray-900">{record.name}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Email:</span>
          <span className="ml-2 text-gray-900">{record.email}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Số điện thoại:</span>
          <span className="ml-2 text-gray-900">{record.phone}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Vai trò:</span>
          <span className="ml-2 text-gray-900">{record.role_name}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Loại:</span>
          <span className="ml-2 text-gray-900">{record.type}</span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-700 w-2/5">Trạng thái tài khoản:</span>
          <span className="ml-2 text-gray-900">{record.account_ban_at ? new Date(record.account_ban_at).toLocaleDateString() : "Không có"}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailStaff;
