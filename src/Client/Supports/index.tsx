import { useArchive } from "@/hooks/useArchive"
import { ISupportInitialState } from "@/services/store/support/support.slice"
import { Button, Input, Select, Table } from "antd"
import { Link } from "react-router-dom"
// import { ITableData } from "@/components/table/PrimaryTable"
import { RootStateType } from "@/services/reducers"
import { getAllSupports } from "@/services/store/support/support.thunk"
import { EFetchStatus } from "@/shared/enums/fetchStatus"
import { ColumnsType } from "antd/es/table"
import { useEffect } from "react"
import { useSelector } from "react-redux"

const Support = () => {
    const isLoggedIn = useSelector((state: RootStateType) => state.auth.isLogin);
    const { state, dispatch } = useArchive<ISupportInitialState>("support");

    useEffect(() => {
        document.body.clientWidth;
    });
    useEffect(() => {
        if (state.status === EFetchStatus.FULFILLED) {
            dispatch(getAllSupports({ query: state.filter }));
        }
    }, [state.status]);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getAllSupports({ query: state.filter }));
        }
    }, [state.filter, isLoggedIn]);

    const columns: ColumnsType = [
        {
            dataIndex: "sender",
            title: "Người gửi",
            render: (_, record) => {
                return <div>{record.sender?.name || "Không xác định"}</div>;
            },
        },
        {
            dataIndex: "email",
            title: "Email",
        },
        {
            dataIndex: "phone",
            title: "Số điện thoại",
        },
        {
            title: "Hỗ trợ",
            dataIndex: "title",
        },
        {
            title: "Yêu cầu",
            dataIndex: "type",
            render: (_, record) => {
                const statusMap: { [key: string]: string } = {
                    1: "Khác",
                    2: "Kỹ thuật",
                    3: "Tự vấn đấu thầu",
                    4: "Hỗ trợ tài khoản",
                    5: "Đề xuất tính năng/Đóng góp ý tưởng",
                    6: "Báo lỗi",
                };
                return (
                    <div className="flex items-center space-x-2">
                        {statusMap[record.type as number] || "Không xác định"}
                    </div>
                );
            },
        },
        {
            title: "Nội dung hỗ trợ",
            dataIndex: "content",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (_, record) => {
                const statusMap: { [key: string]: string } = {
                    "sent": "Đã gửi",
                    "processing": "Đang xử lý",
                    "responded": "Đã xử lý",
                };
                return (
                    <div className="flex items-center space-x-2">
                        {statusMap[record.status as string] || "Không xác định"}
                    </div>
                );
            },
        },
    ];
    return (
        <div className="max-w-screen-xl mx-auto">
            {/* <FormModal
                title="Cập nhật trạng thái"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                // onConfirm={handleConfirmStatus}
            >
                <FormRadio
                    value={selectedStatus}
                    options={statusOptions}
                    onChange={(e: RadioChangeEvent) => {
                        setSelectedStatus(e.target.value)
                    }}
                />
            </FormModal> */}
            <div>
                <h1 className="w-full my-4 text-2xl font-semibold border-b-2 border-cyan-500">Danh sách yêu cầu</h1>
                <div className="flex items-center justify-between">
                    <Link to={`create`} className="flex justify-center items-center text-white font-medium gap-1 bg-blue-400 shadow-inner px-2 rounded-lg">
                        <span className="text-3xl font-bold">+</span>Tạo yêu cầu
                    </Link>
                    <form action="" className="flex gap-2">
                        <Input className="h-10" placeholder="Nhập từ khóa tìm kiếm" />
                        <Select
                            placeholder="Chọn loại hỗ trợ"
                            options={[
                                { value: 1, label: "Khác" },
                                { value: 2, label: "Kỹ thuật" },
                                { value: 3, label: "Tư vấn đấu thầu" },
                                { value: 4, label: "Hỗ trợ tài khoản" },
                                { value: 5, label: "Đề xuất tính năng/Đóng góp ý tưởng" },
                                { value: 6, label: "Báo lỗi" },
                            ]}
                        />
                        {/* <Select
                            placeholder="Chọn trạng thái"
                            options={[
                                { value: 1, label: "Đã gửi" },
                                { value: 2, label: "Đã xử lý" },
                                { value: 3, label: "Đang xử lý" },
                            ]}
                        /> */}
                        <Button type="primary" className="h-10">Tìm kiếm</Button>
                    </form>
                </div>
                {isLoggedIn ? (
                    <Table
                        rowKey="key"
                        columns={columns}
                        dataSource={state.supports || []}
                        loading={state.status === EFetchStatus.PENDING}
                    />
                ) : (
                    <div className="w-full p-6 bg-yellow-400 rounded-lg my-5">
                        Bạn chưa có yêu cầu nào
                    </div>
                )}
            </div>
        </div>
    )
}

export default Support