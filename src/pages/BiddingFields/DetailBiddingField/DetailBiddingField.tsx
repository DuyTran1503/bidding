import React from 'react';
import { ITableData } from "@/components/table/PrimaryTable";

interface BiddingFieldDetailProps {
  record: ITableData;
}

const BiddingFieldDetail: React.FC<BiddingFieldDetailProps> = ({ record }) => {
  return (
    <>
      <p>
        <strong>Tên của lĩnh vực đấu thầu:</strong> {record.name}
      </p>
      <p>
        <strong>Mô tả của lĩnh vực đấu thầu:</strong> {record.description}
      </p>
      <p>
        <strong>Code:</strong> {record.code}
      </p>
      <p>
        <strong>Trạng thái:</strong> {record.is_active ? "True" : "False"}
      </p>
      <p>
        <strong>Lĩnh vực cha:</strong> {record.parent_name}
      </p>
    </>
  );
};

export default BiddingFieldDetail;
