import { Button, Input, RadioChangeEvent, Select, Table } from "antd"
import Banner from "../Home/components/Banner"
import NewNews from "../Home/components/NewNews"
import { Link } from "react-router-dom"
import { ISupportInitialState } from "@/services/store/support/support.slice"
import { useArchive } from "@/hooks/useArchive"
import { ITableData } from "@/components/table/PrimaryTable"
import { useEffect, useState } from "react"
import { ColumnsType } from "antd/es/table"
import { EFetchStatus } from "@/shared/enums/fetchStatus"
import { changeStatusSupport, getAllSupports } from "@/services/store/support/support.thunk"
import FormModal from "@/components/form/FormModal"
import FormRadio from "@/components/form/FormRadio"
import { IOption } from "@/shared/utils/shared-interfaces"
import { mappingSupport, statusEnumArray } from "@/shared/enums/support"

const Support = () => {
    const { state, dispatch } = useArchive<ISupportInitialState>("support");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);
    const statusOptions: IOption[] = statusEnumArray.map((key) => ({
        value: key,
        label: mappingSupport[key],
    }));

    useEffect(() => {
        if (state.status === EFetchStatus.FULFILLED) {
            dispatch(getAllSupports({ query: state.filter }));
        }
    }, [state.status]);

    useEffect(() => {
        dispatch(getAllSupports({ query: state.filter }));
    }, [state.filter]);

    const handleOpenModal = (item: ITableData) => {
        setConfirmItem(item);
        setSelectedStatus(item.status as string); // Lưu trạng thái hiện tại
        setIsModalVisible(true);
    };
    const handleConfirmStatus = () => {
        if (confirmItem && selectedStatus) {
            // Gửi request với id và status
            dispatch(changeStatusSupport({ id: String(confirmItem.key), status: selectedStatus }));
            setIsModalVisible(false);
        }
    };
    const columns: ColumnsType = [
        {
            dataIndex: "index",
            title: "STT",
        },
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
                        <button
                            onClick={() => handleOpenModal(record as ITableData)}
                        >
                            {statusMap[record.status as string] || "Không xác định"}
                        </button>
                    </div>
                );
            },
        },
    ];
    return (
        <div className="max-w-screen-xl mx-auto">
            <Banner />
            <NewNews />
            <FormModal
                title="Cập nhật trạng thái"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onConfirm={handleConfirmStatus}
            >
                <FormRadio
                    value={selectedStatus}
                    options={statusOptions}
                    onChange={(e: RadioChangeEvent) => {
                        setSelectedStatus(e.target.value)
                    }}
                />
            </FormModal>
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
                        <Select
                            placeholder="Chọn loại hỗ trợ"
                            options={[
                                { value: 1, label: "Trạng thái xử lý" },
                                { value: 2, label: "Đã gửi" },
                                { value: 3, label: "Đã xử lý" },
                                { value: 4, label: "Đang xử lý" },
                                { value: 5, label: "Đã đóng" },
                                { value: 6, label: "Lưu nháp" },
                            ]}
                        />
                        <Button type="primary" className="h-10">Tìm kiếm</Button>
                    </form>
                </div>
                {/* <div className="w-full p-6 bg-yellow-400 rounded-lg my-5">
                    Bạn chưa có yêu cầu nào
                </div> */}
                <Table
                    rowKey="key"
                    columns={columns}
                    dataSource={state.supports || []}
                    loading={state.status === EFetchStatus.PENDING}
                />
            </div>
        </div>
    )
}

export default Support