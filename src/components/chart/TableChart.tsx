import React from "react";

interface TableProps {
    compareData: { id: string; name: string; value: number | string }[]; // Data array for the table rows
    investorId: string; // ID to highlight a specific row
    valueType?: "currency" | "quantity" | "date"; // Type of value: currency, quantity, or date
    chartType?: "bar" | "pie"
}

const TableChart: React.FC<TableProps> = ({ compareData, investorId, valueType = "quantity", chartType = "bar" }) => {
    // Function to convert date strings to year difference or days
    // const formatNumber = (num: number) => {
    //     if (num >= 1e9) return new Intl.NumberFormat('vi-VN').format(num / 1e9) + " tỷ";
    //     if (num >= 1e6) return new Intl.NumberFormat('vi-VN').format(num / 1e6) + " triệu";
    //     return new Intl.NumberFormat('vi-VN').format(num);
    // };

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

            <table className="w-full">
                <thead>
                    <tr>
                        <th className="p-3 border border-gray-100 bg-white font-bold text-center">STT</th>
                        <th className="p-3 border border-gray-100 bg-white font-bold text-center">Tên dự án</th>
                        <th className="p-3 border border-gray-100 bg-white font-bold text-center">
                            {valueType === "currency" ? 'Tổng số tiền' : valueType === "date" ? 'Thời gian' : 'Số lượng'}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {compareData.map((item, index) => (
                        <tr
                            key={index}
                            className={
                                item.id == investorId
                                    ? "bg-red-300"
                                    : index % 2 === 0
                                        ? "bg-gray-25"
                                        : "bg-white"
                            }
                        >
                            <td className="p-3 border border-gray-100 text-center">{++index}</td>
                            <td className="p-3 border border-gray-100 text-center">{item.name}</td>
                            <td className="p-3 border border-gray-100 text-center">
                                {formatValue(item.value)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default TableChart;
