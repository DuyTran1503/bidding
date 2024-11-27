import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-6">Trang bạn tìm kiếm không tồn tại.</p>
      <Link
        to="/"
        className="px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600 transition"
      >
        Quay về Trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
