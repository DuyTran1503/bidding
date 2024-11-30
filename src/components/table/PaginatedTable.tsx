import React from "react";
import { Table } from "antd";

interface PaginatedTableProps {
  columns: any[]; // Cấu trúc cột của Table
  dataSource: any[]; // Dữ liệu hiển thị
  currentPage: number; // Trang hiện tại
  pageSize: number; // Số bản ghi mỗi trang
  totalRecords: number; // Tổng số bản ghi
  onPageChange: (page: number, pageSize: number) => void; // Hàm xử lý khi thay đổi trang
  rowKey?: string; // Key duy nhất cho mỗi hàng, mặc định là "id"
  rowSelection?: any; // Hỗ trợ chọn hàng (nếu cần)
  bordered?: boolean; // Hiển thị border cho table
}

const PaginatedTable: React.FC<PaginatedTableProps> = ({
  columns,
  dataSource,
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
  rowKey = "id", // Giá trị mặc định là "id"
  bordered = false,
}) => {
  
  const columnsWithIndex = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[20px]",
      render: (_: any, __: any, index: number) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    ...columns,
  ];
  return (
    <Table
      expandable={{
        expandedRowRender: undefined, // Không hiển thị chi tiết mở rộng
        expandIconColumnIndex: -1, // Loại bỏ cột chứa dấu "+"
      }}
      columns={columnsWithIndex} // Các cột hiển thị
      dataSource={dataSource} // Dữ liệu hiển thị
      pagination={{
        current: currentPage, // Trang hiện tại
        pageSize: pageSize, // Số bản ghi mỗi trang
        total: totalRecords, // Tổng số bản ghi
        showSizeChanger: false, // Hiển thị dropdown chọn số bản ghi mỗi trang
        onChange: (page, size) => onPageChange(page, size), // Xử lý thay đổi trang hoặc pageSize
        showTotal: (total, range) =>
          `Hiển thị ${range[0]}-${range[1]} trên tổng ${total} bản ghi`,
      }}
      rowKey={rowKey} // Key duy nhất cho mỗi hàng
      bordered={bordered} // Border của bảng
      scroll={{ x: "max-content" }} // Hỗ trợ cuộn ngang nếu dữ liệu dài
    />
  );
};

export default PaginatedTable;
