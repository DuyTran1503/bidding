import PaginatedTable from "@/components/table/PaginatedTable";
import { useArchive } from "@/hooks/useArchive";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getAllProjectInvestor } from "@/services/store/project/project.thunk";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { convertTimestamp } from "@/shared/utils/common/convertTimestamp";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Investor = () => {
    const { state: projectState, dispatch: projectDispatch } = useArchive<IProjectInitialState>("project");
    const { id } = useParams();
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    const handlePageChange = (page: number, pageSize: number) => {
        projectDispatch({
            type: "project/updateFilter",
            payload: { page, size: pageSize },
        });
    };

    const handleRowSelection = {
        selectedRowKeys, // Các hàng đang được chọn
        onChange: (keys: any) => setSelectedRowKeys(keys), // Xử lý chọn hàng
    };

    const columns: ColumnsType = [
        {
            dataIndex: "name",
            title: "Tên dự án",
            render: (text: string, record) => (
                <Link    to={`/project/detail/${record.id}`} className="hover:text-cyan-600">
                    {text}
                </Link>
            ),
        },
        {
            dataIndex: "total_amount",
            title: "Tổng giá gói thầu",
            render(_, record) {
                return convertMoney(record?.total_amount);
            },
        },
        {
            dataIndex: "upload_time",
            title: "Ngày đăng tải",
            render(_, record) {
                return convertTimestamp(record?.upload_time);
            },
        },
    ];

    // Lấy dữ liệu từ API khi trang hoặc kích thước trang thay đổi
    useEffect(() => {
        projectDispatch(getAllProjectInvestor({
            query: {
                ...projectState.projects,
                page: projectState.filter.page,
                size: projectState.filter.size,
                investor: id
            },
        }));
    }, [projectDispatch, projectState.filter.page, projectState.filter.size, id]);

    // Thêm key cho mỗi record nếu chưa có
    const dataSourceWithKey = projectState.investorProjects.map((item, index) => ({
        ...item,
        key: `key_${index}` // Dùng id hoặc tên làm key duy nhất
    }));

    return (
        <div className="pt-2">
            <h2 className="my-4 text-xl font-medium">
                Danh sách dự án đầu tư <span className="ml-2 text-sm text-gray-500">
                    Tổng: ({projectState.totalRecordInvestor} dự án)
                </span>
            </h2>

            <PaginatedTable
                columns={columns}
                dataSource={dataSourceWithKey} // Cập nhật dataSource để thêm key
                currentPage={projectState.filter.page}
                pageSize={projectState.filter.size}
                totalRecords={projectState.totalRecordInvestor as number}
                onPageChange={handlePageChange}
                rowSelection={handleRowSelection} // Hỗ trợ chọn hàng
                bordered={true} // Hiển thị border bảng
            />
        </div>
    );
};

export default Investor;
