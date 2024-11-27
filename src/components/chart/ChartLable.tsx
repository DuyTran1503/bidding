import React from 'react';

interface ChartLabelProps {
  value: string[]; // Mảng giá trị thay thế cho các mức
}

const ChartLabel: React.FC<ChartLabelProps> = ({ value }) => {
  const labels = ['0', '1', '2', '3', '4']; // Các mức cố định

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[250px] mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Ghi chú Biểu đồ</h3>
      <ul className="space-y-2">
        {labels.map((label, index) => (
          <li
            key={index}
            className="flex justify-between items-center text-gray-700 border-b border-gray-200 pb-2"
          >
            <span className="font-medium">{label}</span>
            <span>{value[index] || 'Chưa có dữ liệu'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChartLabel;
