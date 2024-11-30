import CustomerAvatar from "@/components/common/CustomerAvatar";
import PaginatedTable from "@/components/table/PaginatedTable";
import { useArchive } from "@/hooks/useArchive";
import { IEmployeeInitialState } from "@/services/store/employee/employee.slice";
import { getAllEmployee } from "@/services/store/employee/employee.thunk";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const Employee = () => {
    const { state, dispatch } = useArchive<IEmployeeInitialState>("employee");
    const { id } = useParams();
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const handlePageChange = (page: number, pageSize: number) => {
        dispatch({
            type: "employee/updateFilter",
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
            title: "Name",
            className: "w-[200px]",
        },
        {
            dataIndex: "avatar",
            title: "Ảnh đại diện",
            render(_, record) {
                return <CustomerAvatar src={!!record.avatar && record.avatar} alt={"Ảnh đại diện"} />;
            },
            className: "!h-auto"
        },
        {
            dataIndex: "email",
            title: "Email",
            className: "w-[200px]",
        },
        {
            dataIndex: "phone",
            title: "Số điện thoại",
            className: "w-[150px]",
        },
    ];

    useEffect(() => {
        dispatch(getAllEmployee({
            query: {
                ...state.employees,
                page: state.filter.page,
                size: state.filter.size,
                enterprise: id
            },
        }))
    }, [dispatch, state.filter.page, state.filter.size, id]);

    return (
        <div className="pt-2">
            <h2 className="my-4 text-xl font-medium">
                Danh sách nhân viên <span className="ml-2 text-sm text-gray-500">
                    Tổng: ({state.totalRecords} nhân viên)
                </span>
            </h2>

            <PaginatedTable
                columns={columns}
                dataSource={state.employees}
                currentPage={state.filter.page}
                pageSize={state.filter.size}
                totalRecords={state.totalRecords}
                onPageChange={handlePageChange}
                rowSelection={handleRowSelection}
                bordered={true}
            />

        </div>
    );
};

export default Employee;
