import React from "react";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";

const MarketOverview: React.FC = () => (
  <div className="w-full">
    <h2 className="mb-4 text-xl font-semibold">1. Tổng quan về thị trường đấu thầu</h2>
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={24} md={24} xl={12}>
        <h3 className="mb-4 text-lg font-semibold">Tổng giá trị trúng thầu toàn quốc</h3>
        <ul className="list-inside list-disc">
          <li>Thống kê tổng giá trị công bố trúng thầu của thị trường đấu thầu Việt Nam trong 12 tháng qua.</li>
          <li>Thống kê đã loại trừ các gói thầu đã công bố kết quả nhưng sau đó đã bị huỷ bỏ.</li>
        </ul>
      </Col>
      <Col xs={24} sm={24} md={24} xl={12}>
        <h3 className="mb-4 text-lg font-semibold">Tổng số gói thầu</h3>
        <p>
          Thống kê tổng số gói thầu đã được đăng tải chào thầu công khai trên
          <Link to="https://muasamcong.mpi.gov.vn" className="text-blue-500">
            {" "}https://muasamcong.mpi.gov.vn{" "}
          </Link>
          Trong số này, chúng tôi cũng đã phân loại chia theo:
        </p>
        <ul className="list-inside list-disc">
          <li>Số gói thầu đã đóng</li>
          <li>Số gói thầu đang mở thầu</li>
          <li>Số gói thầu mới đăng tải trong 24h</li>
          <li>Số gói thầu mới có cập nhật/thay đổi trạng thái trong ngày</li>
        </ul>
      </Col>
    </Row>
  </div>
);

export default MarketOverview;
