import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IChartEnterprise } from "@/services/store/enterprise_chart/enterprise_chart.model";
import { Link } from "react-router-dom";
import { emptyText } from "@/components/table/PrimaryTable";

interface EnterpriseDetailProps {
  detailEnterpriseByIds: IChartEnterprise[]; // Renamed to reflect "enterprise"
  enterpriseId: string; // Renamed to reflect "enterprise"
}

// Định nghĩa kiểu dữ liệu cho các dòng (rows)
interface RowType {
  key: string;
  title: string;
  dataIndex: keyof IChartEnterprise; // Renamed to reflect "enterprise"
  render?: (item: any) => React.ReactNode;
}

const EnterpriseDetail: React.FC<EnterpriseDetailProps> = ({ detailEnterpriseByIds, enterpriseId }) => {
  // Tạo dữ liệu dạng hàng cho bảng với kiểu `RowType`
  const rows: RowType[] = [
    { key: "email", title: "Địa chỉ email", dataIndex: "email" },
    { key: "phone", title: "Số điện thoại", dataIndex: "phone" },
    { key: "website", title: "Website", dataIndex: "website" },
    { key: "address", title: "Địa chỉ", dataIndex: "address" },
    { key: "taxcode", title: "Mã số thuế", dataIndex: "taxcode" },
    {
      key: "industry_id",
      title: "Lĩnh vực kinh doanh",
      dataIndex: "industry_id",
      render: (industry_id: { id: number; name: string }[]) => {
        return (
          <>
            {industry_id.map((child) => (
              <div key={child.id}>{child.name || "Không có"}</div>
            ))}
          </>
        );
      },
    },
    {
      key: "organization_type",
      title: "Loại hình tổ chức",
      dataIndex: "organization_type",
      render: (value) => (value == 1 ? "Doanh nghiệp nhà nước" : value == 2 ? "Ngoài nhà nước" : "Thông tin không có"),
    },
    {
      key: "is_active",
      title: "Trạng thái",
      dataIndex: "is_active",
      render: (value) => (value == 0 ? "Đang hoạt động" : value == 1 ? "Dừng hoạt động" : "Thông tin không có"),
    }, // Renamed to "Doanh nghiệp"
    { key: "establish_date", title: "Ngày thành lập", dataIndex: "establish_date" },
    { key: "establish_date", title: "Ngày thành lập", dataIndex: "establish_date" },
    { key: "registration_date", title: "Ngày đăng ký", dataIndex: "registration_date" },
    {
      key: "description",
      title: "Mô tả",
      dataIndex: "description",
      render: (description: string) => <div className="line-clamp-6" dangerouslySetInnerHTML={{ __html: description }} />,
    },
    // { key: 'children', title: 'Gói thầu con', dataIndex: 'children', render: (item) => item.length },
  ];

  // Tách doanh nghiệp có `id` trùng với `enterpriseId` và các doanh nghiệp còn lại
  const mainEnterprise = detailEnterpriseByIds.find((enterprise) => enterprise.id === enterpriseId); // Renamed to "enterprise"
  const otherEnterprises = detailEnterpriseByIds.filter((enterprise) => enterprise.id !== enterpriseId); // Renamed to "enterprise"

  // Xây dựng cột động với kiểu `ColumnsType`
  const columns = [
    {
      title: "Tên doanh nghiệp",
      dataIndex: "title",
      key: "title",
      fixed: "left", // Cố định cột đầu tiên
      width: 150,
      className: "font-bold text-black-500", // In đậm cột đầu tiên
    },
    mainEnterprise
      ? {
          title: <Link to={`/enterprise/detail/${mainEnterprise.id}`}>{mainEnterprise.name}</Link>, // Renamed to "Doanh nghiệp"
          dataIndex: "mainEnterprise",
          key: "mainEnterprise",
          fixed: "left", // Cố định cột của doanh nghiệp chính
          width: 200,
          render: (text: any) => text || "Không có",
        }
      : undefined,
    ...otherEnterprises.map((enterprise, index) => ({
      // Renamed to "enterprise"
      title: <Link to={`/enterprise/detail/${enterprise.id}`}>{enterprise.name}</Link>, // Renamed to "Doanh nghiệp"
      dataIndex: `enterprise_${index}`, // Renamed to "enterprise"
      key: `enterprise_${index}`, // Renamed to "enterprise"
      width: 200,
      render: (text: any) => text || "Không có",
    })),
  ].filter(Boolean); // Lọc bỏ phần tử `undefined` nếu `mainEnterprise` không tồn tại

  // Chuẩn bị dataSource cho bảng, mỗi dòng sẽ là một trường thông tin của doanh nghiệp
  const dataSource = rows.map((row) => {
    const rowData: Record<string, any> = {
      key: row.key,
      title: row.title,
    };

    if (mainEnterprise) {
      rowData["mainEnterprise"] = row.render ? row.render(mainEnterprise[row.dataIndex]) : mainEnterprise[row.dataIndex]; // Renamed to "mainEnterprise"
    }

    otherEnterprises.forEach((enterprise, index) => {
      // Renamed to "enterprise"
      rowData[`enterprise_${index}`] = row.render ? row.render(enterprise[row.dataIndex]) : enterprise[row.dataIndex]; // Renamed to "enterprise"
    });

    return rowData;
  });

  return (
    <Table
      columns={columns as ColumnsType<any>} // Ép kiểu rõ ràng cho columns
      dataSource={dataSource}
      pagination={false} // Tắt phân trang
      scroll={{ x: "max-content" }} // Cho phép cuộn ngang
      bordered // Hiển thị border cho bảng
      locale={{ emptyText }}
    />
  );
};

export default EnterpriseDetail;
