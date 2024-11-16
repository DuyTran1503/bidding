import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IChartEnterprise } from '@/services/store/enterprise_chart/enterprise_chart.model';

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
        { key: 'id', title: 'ID Doanh nghiệp', dataIndex: 'id' }, // Renamed to "Doanh nghiệp"
        { key: 'name', title: 'Tên doanh nghiệp', dataIndex: 'name' }, // Renamed to "Doanh nghiệp"
        { key: 'email', title: 'Địa chỉ email', dataIndex: 'email' },
        { key: 'phone', title: 'Số điện thoại', dataIndex: 'phone' },
        { key: 'website', title: 'Website', dataIndex: 'website' },
        { key: 'address', title: 'Địa chỉ', dataIndex: 'address' },
        { key: 'taxcode', title: 'Mã số thuế', dataIndex: 'taxcode'},
        { key: 'industry_id', title: 'Ngành', dataIndex: 'industry_id', render: (item) => item?.industry_id || 'Không có' },
        { key: 'is_active', title: 'Trạng thái', dataIndex: 'is_active', render: (item) => item?.is_active || 'Không có' }, // Renamed to "Doanh nghiệp"
        { key: 'organization_type', title: 'Loại hình tổ chức', dataIndex: 'organization_type', render: (item) => item?.organization_type || 'Không có' },
        { key: 'establish_date', title: 'Ngày thành lập', dataIndex: 'establish_date' },
        { key: 'description', title: 'Mô tả', dataIndex: 'description' },
        // {
        //     key: 'total_amount',
        //     title: 'Giá',
        //     dataIndex: 'total_amount',
        //     render: (amount: number) => amount ? (
        //         <>
        //             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
        //         </>
        //     ) : 'Không có',
        // },
        { key: 'establish_date', title: 'Ngày thành lập', dataIndex: 'establish_date' },
        { key: 'registration_date', title: 'Ngày đăng ký', dataIndex: 'registration_date' },
        // { key: 'children', title: 'Gói thầu con', dataIndex: 'children', render: (item) => item.length },
    ];

    // Tách doanh nghiệp có `id` trùng với `enterpriseId` và các doanh nghiệp còn lại
    const mainEnterprise = detailEnterpriseByIds.find((enterprise) => enterprise.id === enterpriseId); // Renamed to "enterprise"
    const otherEnterprises = detailEnterpriseByIds.filter(enterprise => enterprise.id !== enterpriseId); // Renamed to "enterprise"

    // Xây dựng cột động với kiểu `ColumnsType`
    const columns = [
        {
            title: 'Thông tin',
            dataIndex: 'title',
            key: 'title',
            fixed: 'left', // Cố định cột đầu tiên
            width: 150,
            className: 'font-bold text-black-500', // In đậm cột đầu tiên
        },
        mainEnterprise ? {
            title: mainEnterprise.name || `Doanh nghiệp ${mainEnterprise.id}`, // Renamed to "Doanh nghiệp"
            dataIndex: 'mainEnterprise',
            key: 'mainEnterprise',
            fixed: 'left', // Cố định cột của doanh nghiệp chính
            width: 200,
            render: (text: any) => text || 'Không có',
        } : undefined,
        ...otherEnterprises.map((enterprise, index) => ({ // Renamed to "enterprise"
            title: enterprise.name || `Doanh nghiệp ${index + 1}`, // Renamed to "Doanh nghiệp"
            dataIndex: `enterprise_${index}`, // Renamed to "enterprise"
            key: `enterprise_${index}`, // Renamed to "enterprise"
            width: 200,
            render: (text: any) => text || 'Không có',
        })),
    ].filter(Boolean); // Lọc bỏ phần tử `undefined` nếu `mainEnterprise` không tồn tại

    // Chuẩn bị dataSource cho bảng, mỗi dòng sẽ là một trường thông tin của doanh nghiệp
    const dataSource = rows.map(row => {
        const rowData: Record<string, any> = {
            key: row.key,
            title: row.title,
        };

        if (mainEnterprise) {
            rowData['mainEnterprise'] = row.render ? row.render(mainEnterprise[row.dataIndex]) : mainEnterprise[row.dataIndex]; // Renamed to "mainEnterprise"
        }

        otherEnterprises.forEach((enterprise, index) => { // Renamed to "enterprise"
            rowData[`enterprise_${index}`] = row.render ? row.render(enterprise[row.dataIndex]) : enterprise[row.dataIndex]; // Renamed to "enterprise"
        });

        return rowData;
    });

    return (
        <Table
            columns={columns as ColumnsType<any>} // Ép kiểu rõ ràng cho columns
            dataSource={dataSource}
            pagination={false} // Tắt phân trang
            scroll={{ x: 'max-content' }} // Cho phép cuộn ngang
            bordered // Hiển thị border cho bảng
        />
    );
};

export default EnterpriseDetail;
