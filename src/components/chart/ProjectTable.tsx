import React from 'react';
import { Table, Tooltip } from 'antd';
import { ICompareProject } from '@/services/store/CompareProject/compareProject.model';
import PDF from "@/assets/images/pdf.png";
import EXCEL from "@/assets/images/excel.png";
import WORD from "@/assets/images/word.jpg";
import { Link } from 'react-router-dom';

interface ProjectDetailProps {
    detailProjectByIds: ICompareProject[];
    projectId: string;
}

interface RowType {
    key: string;
    title: string;
    dataIndex: keyof ICompareProject;
    render?: (item: any) => React.ReactNode;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ detailProjectByIds, projectId }) => {
    
const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return PDF;
      case "xlsx":
      case "xls":
        return EXCEL;
      case "doc":
      case "docx":
        return WORD;
      default:
        return "📁";
    }
  };
    const rows: RowType[] = [
        // { key: 'name', title: 'Tên dự án', dataIndex: 'name' },
        { key: 'decision_number_issued', title: 'Số quyết định', dataIndex: 'decision_number_issued' },
        { key: 'tenderer', title: 'Nhà thầu', dataIndex: 'tenderer', render: (item) => <Link to={`/enterprise/detail/` + item.id}>{item?.name || 'Không có'}</Link> },
        {
            key: 'procurement_categories', title: 'Lĩnh vực mua sắm công', dataIndex: 'procurement_categories',
            render: (procurement_categories: { id: number; name: string }[]) => {
                if (!procurement_categories || procurement_categories.length === 0) {
                    return 'Không có';
                }
                return (
                    <>
                        {procurement_categories.map((child) => (
                            <div key={child.id}>
                                {child.name || 'Không có'}
                            </div>
                        ))}
                    </>
                );
            },
        },
        { key: 'investor', title: 'Nhà đầu tư', dataIndex: 'investor', render: (item) => <Link to={`/enterprise/detail/` + item.id}>{item?.name || 'Không có'}</Link> },
        { key: 'staff', title: 'Người phê duyệt', dataIndex: 'staff', render: (item) => <Link to={`/staff/detail/` + item.id}>{item?.name || 'Không có'}</Link> },
        { key: 'selection_method', title: 'Hình thức lựa chọn', dataIndex: 'selection_method', render: (item) => item?.method_name || 'Không có' },
        {
            key: 'submission_method',
            title: 'Phương thức nộp',
            dataIndex: 'submission_method',
            render: (method: string) =>
                method === 'online' ? 'Online' : method === 'in_person' ? 'Trực tiếp' : 'Không xác định',
        },
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
        {
            key: 'children', title: 'Gói thầu con', dataIndex: 'children',
            render: (children: { id: number; name: string }[]) => {
                if (!children || children.length === 0) {
                    return 'Không có';
                }
                return (
                    <>
                        {children.map((child) => (
                            <div key={child.id}>
                                <Link to={`/project/detail/${child.id}`}>
                                    {child.name || 'Không có'}
                                </Link>
                            </div>
                        ))}
                    </>
                );
            },
        },
        {
            key: 'description',
            title: 'Mô tả dự án',
            dataIndex: 'description',
            render: (description: string) => (
                <div dangerouslySetInnerHTML={{ __html: description }} />
            ),
        },
        {
            key: 'attachments',
            title: 'Tệp đính kèm',
            dataIndex: 'attachments',
            render: (attachments: { type: string; path: string; name: string }[]) => (
                <div className='flex gap-2'>
                    {attachments && attachments.length > 0 ? (
                        attachments.map((file, index) => (
                            <Tooltip title={file.name} color={"#108ee9"} key={index}>
                            <a
                              href={file.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 transition-opacity hover:opacity-80"
                            >
                              {file.type && getFileIcon(file.type) && (
                                <img src={getFileIcon(file.type)} alt={file.type} className="h-6 w-6 object-contain" />
                              )}
                            </a>
                          </Tooltip>
                        ))
                    ) : (
                        'Không có tệp đính kèm'
                    )}
                </div>
            ),
        }
        
    ];

    const mainProject = detailProjectByIds.find((project) => project.id === projectId);
    const otherProjects = detailProjectByIds.filter((project) => project.id !== projectId);

    const createColumns = () => {
        const columns: { title: React.ReactNode; dataIndex: string; key: string; width: number; className?: string }[] = [
            {
                title: 'Tên Dự án',
                dataIndex: 'title',
                key: 'title',
                width: 150,
                className: 'font-bold text-black-500'
            },
        ];

        if (mainProject) {
            columns.push({
                title: mainProject.name ? (
                    <Link to={`/project/detail/${mainProject.id}`}>{mainProject.name}</Link>
                ) : `Dự án ${mainProject.id}`,
                dataIndex: 'mainProject',
                key: 'mainProject',
                width: 200,
            });
        }

        otherProjects.forEach((project, index) => {
            columns.push({
                title: project.name ? (
                    <Link to={`/project/detail/${project.id}`}>{project.name}</Link>
                ) : `Dự án ${index + 1}`,
                dataIndex: `project_${index}` as keyof ICompareProject,
                key: `project_${index}`,
                width: 200,
            });
        });

        return columns;
    };

    const createDataSource = (rowKeys: RowType[]) =>
        rowKeys.map((row) => {
            const rowData: Record<string, any> = { key: row.key, title: row.title };

            if (mainProject) {
                rowData['mainProject'] = row.render
                    ? row.render(mainProject[row.dataIndex])
                    : mainProject[row.dataIndex];
            }

            otherProjects.forEach((project, index) => {
                rowData[`project_${index}`] = row.render
                    ? row.render(project[row.dataIndex])
                    : project[row.dataIndex];
            });

            return rowData;
        });

    // const subTables = [
    //     {
    //         title: 'Danh sách Nhà thầu',
    //         rows: [
    //             { key: 'tenderer', title: 'Nhà thầu', dataIndex: 'tenderer' as keyof ICompareProject, render: (item: ICompareProject) => item?.name || 'Không có' },
    //         ],
    //     },
    //     {
    //         title: 'Danh sách Nhà đầu tư',
    //         rows: [
    //             { key: 'investor', title: 'Nhà đầu tư', dataIndex: 'investor' as keyof ICompareProject, render: (item: ICompareProject) => item?.name || 'Không có' },
    //         ],
    //     },
    // ];

    return (
        <div>
            <h2 className="font-bold text-lg mb-4">Thông tin tổng quan</h2>
            <Table
                columns={createColumns()}
                dataSource={createDataSource(rows)}
                pagination={false}
                scroll={{ x: 'max-content' }}
                bordered
            />
            {/* {subTables.map((table, index) => (
                <div key={index}>
                    <h2 className="font-bold text-lg mt-8 mb-4">{table.title}</h2>
                    <Table
                        columns={createColumns()}
                        dataSource={createDataSource(table.rows)}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        bordered
                    />
                </div>
            ))} */}
        </div>
    );
};

export default ProjectDetail;
