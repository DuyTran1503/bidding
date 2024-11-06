import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ICompareProject } from '@/services/store/CompareProject/compareProject.model';

interface ProjectDetailProps {
    detailProjectByIds: ICompareProject[];
    projectId: string;
}

// Định nghĩa kiểu dữ liệu cho các dòng (rows)
interface RowType {
    key: string;
    title: string;
    dataIndex: keyof ICompareProject;
    render?: (item: any) => React.ReactNode;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ detailProjectByIds, projectId }) => {
    // Tạo dữ liệu dạng hàng cho bảng với kiểu `RowType`
    const rows: RowType[] = [
        { key: 'id', title: 'ID Dự án', dataIndex: 'id' },
        { key: 'name', title: 'Tên dự án', dataIndex: 'name' },
        { key: 'decision_number_issued', title: 'Số quyết định', dataIndex: 'decision_number_issued' },
        { key: 'tenderer', title: 'Nhà thầu', dataIndex: 'tenderer', render: (item) => item?.name || 'Không có' },
        { key: 'investor', title: 'Nhà đầu tư', dataIndex: 'investor', render: (item) => item?.name || 'Không có' },
        { key: 'staff', title: 'Trưởng dự án', dataIndex: 'staff', render: (item) => item?.name || 'Không có' },
        { key: 'selection_method', title: 'Hình thức lựa chọn', dataIndex: 'selection_method', render: (item) => item?.method_name || 'Không có' },
        { key: 'location', title: 'Địa điểm', dataIndex: 'location' },
        { key: 'receiving_place', title: 'Nơi nhận', dataIndex: 'receiving_place' },
        {
            key: 'total_amount',
            title: 'Giá',
            dataIndex: 'total_amount',
            render: (amount: number) => amount ? (
                <>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
                </>
            ) : 'Không có',
        },
        { key: 'start_time', title: 'Ngày bắt đầu', dataIndex: 'start_time' },
        { key: 'end_time', title: 'Ngày kết thúc', dataIndex: 'end_time' },
        { key: 'children', title: 'Gói thầu con', dataIndex: 'children', render: (item) => item.length },
    ];

    // Tách dự án có `id` trùng với `projectId` và các dự án còn lại
    const mainProject = detailProjectByIds.find((project) => project.id === projectId);
    const otherProjects = detailProjectByIds.filter(project => project.id !== projectId);

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
        mainProject ? {
            title: mainProject.name || `Dự án ${mainProject.id}`,
            dataIndex: 'mainProject',
            key: 'mainProject',
            fixed: 'left', // Cố định cột của dự án chính
            width: 200,
            render: (text: any) => text || 'Không có',
        } : undefined,
        ...otherProjects.map((project, index) => ({
            title: project.name || `Dự án ${index + 1}`,
            dataIndex: `project_${index}`,
            key: `project_${index}`,
            width: 200,
            render: (text: any) => text || 'Không có',
        })),
    ].filter(Boolean); // Lọc bỏ phần tử `undefined` nếu `mainProject` không tồn tại

    // Chuẩn bị dataSource cho bảng, mỗi dòng sẽ là một trường thông tin của dự án
    const dataSource = rows.map(row => {
        const rowData: Record<string, any> = {
            key: row.key,
            title: row.title,
        };

        if (mainProject) {
            rowData['mainProject'] = row.render ? row.render(mainProject[row.dataIndex]) : mainProject[row.dataIndex];
        }

        otherProjects.forEach((project, index) => {
            rowData[`project_${index}`] = row.render ? row.render(project[row.dataIndex]) : project[row.dataIndex];
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

export default ProjectDetail;
