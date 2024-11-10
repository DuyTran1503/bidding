import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface TableProps {
    compareData: { id: string; name: string; value: number | string }[]; // Data array for the table rows
    projectId: string; // ID to highlight a specific row
    valueType?: "currency" | "quantity" | "date"; // Type of value: currency, quantity, or date
    chartType?: "bar" | "pie";
}

const TableChart: React.FC<TableProps> = ({ compareData, projectId, valueType = "quantity", chartType = "bar" }) => {

    // Hàm định dạng số cho các giá trị khác
    const formatValue = (val: number | string) => {
        if (valueType === "currency") {
            return new Intl.NumberFormat('vi-VN').format(Number(val)) + " VND";
        } else if (valueType === "date") {
            return convertToYearsOrDays(val);
        } else {
            return new Intl.NumberFormat('vi-VN').format(Number(val));
        }
    };

    // Hàm chuyển đổi ngày thành số năm hoặc ngày
    const convertToYearsOrDays = (value: string | number) => {
        if (typeof value === 'number') {
            const years = Math.floor(value / 365);
            const remainingDays = value % 365;
            const months = Math.floor(remainingDays / 30);
            const days = remainingDays % 30;
            if (years > 0) return `${years} năm${months > 0 ? ` - ${months} tháng` : ''}${days > 0 ? ` - ${days} ngày` : ''}`;
            if (months > 0) return `${months} tháng${days > 0 ? ` - ${days} ngày` : ''}`;
            return `${days} ngày`;
        } else {
            const currentDate = new Date();
            const inputDate = new Date(value);
            if (isNaN(inputDate.getTime())) return value; // Return original value if not a valid date
            const totalDays = Math.floor((currentDate.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24));
            const years = Math.floor(totalDays / 365);
            const remainingDays = totalDays % 365;
            const months = Math.floor(remainingDays / 30);
            const days = remainingDays % 30;
            if (years > 0) return `${years} năm${months > 0 ? ` - ${months} tháng` : ''}${days > 0 ? ` - ${days} ngày` : ''}`;
            if (months > 0) return `${months} tháng${days > 0 ? ` - ${days} ngày` : ''}`;
            return `${days} ngày`;
        }
    };

    // Cấu hình các cột của bảng
    const columns: ColumnsType<{ id: string; name: string; value: number | string }> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_text, _record, index) => index + 1,
            align: 'center',
            width: 100,
        },
        {
            title: 'Tên dự án',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: valueType === "currency" ? 'Tổng số tiền' : valueType === "date" ? 'Thời gian' : 'Số lượng',
            dataIndex: 'value',
            key: 'value',
            render: (value) => formatValue(value),
            align: 'center',
        },
    ];

    // Cấu hình dataSource cho bảng, thêm key để mỗi hàng là duy nhất
    const dataSource = compareData.map((item, index) => ({
        ...item,
        key: index,
        className: item.id === projectId ? "highlight-row" : index % 2 === 0 ? "even-row" : "odd-row",
    }));

    // Tùy chỉnh kiểu bảng cho các hàng
    const rowClassName = (record: { id: string }) =>
        record.id == projectId ? "bg-red-300" : "";

    return (
        <>
            {chartType === "bar" && (
                <div className="flex items-center justify-center space-x-4 mb-12">
                    <div className="flex items-center">
                        <div className="w-6 h-4 bg-[#5470C6] mr-1 rounded-[4px]"></div>
                        <span>Gói thầu bạn chọn so sánh</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-6 h-4 bg-[#FF0000] mr-1 rounded-[4px]"></div>
                        <span>Gói thầu mặc định</span>
                    </div>
                </div>
            )}

            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                rowClassName={rowClassName}
                bordered
            />
        </>
    );
};

export default TableChart;
