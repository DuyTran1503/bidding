import React from "react";
import { ITableData } from "@/components/table/PrimaryTable";
interface DetailActivityLogProps {
  record: ITableData;
}

const DetailActivityLogProps: React.FC<DetailActivityLogProps> = ({ record }: ITableData | any) => {
  return (
    <div className="bg-white p-6">
      <h2 className="mb-4 text-2xl font-semibold">Chi tiết loại hình hoạt động</h2>
      <div className="flex flex-col gap-3">
        <div className="text-m-medium mb-1 block font-semibold text-black-900">Tên loại hình hoạt động: {record?.log_name}</div>
        <div>
          <span className="text-m-medium mb-1 font-semibold text-black-900">
            Mô tả:
            <span className="mb-1 ml-2 text-sm text-black-300">{record?.description}</span>
          </span>
        </div>
        {/* <div className="text-m-medium mb-1 block font-semibold text-black-900">Trạng thái</div> */}
      </div>
    </div>
  );
};

export default DetailActivityLogProps;