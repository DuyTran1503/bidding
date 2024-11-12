import React, { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";

const Loading: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Giả lập quá trình tải dữ liệu (2 giây)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <ThreeDot color="#1890ff" />
      </div>
    );
  }

  return (
    <div>
      <h1>Nội dung trang của bạn</h1>
      <button onClick={() => navigate("/next-page")}>Đi đến trang tiếp theo</button>
    </div>
  );
};

export default Loading;
