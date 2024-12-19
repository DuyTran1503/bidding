import { Col, Row } from 'antd'

const Overview = () => {
    return (
        <div className="w-full">
            <h2 className="mb-4 text-xl font-semibold">1. Tổng quan về thị trường đấu thầu</h2>
            <Row gutter={[16, 16]}>
                {/* <Col xs={24} sm={24} md={24} xl={12}>
                    <h3 className="mb-4 text-lg font-semibold">Tổng giá trị trúng thầu toàn quốc</h3>
                    <ul className="list-inside list-disc">
                        <li>Thống kê tổng giá trị công bố trúng thầu của thị trường đấu thầu việt nam trong 12 tháng qua.</li>
                        <li>Thống kê đã loại trừ các gói thầu đã công bố kết quả nhưng sau đó đã bị huỷ bỏ.</li>
                    </ul>
                </Col>
                <Col xs={24} sm={24} md={24} xl={12}>
                    <h3 className="mb-4 text-lg font-semibold">Tổng số gói thầu</h3>
                    <p>
                        Thống kê tổng số gói thầu đã được đăng tải chào thầu công khai trên
                        <Link to={"https://muasamcong.mpi.gov.vn"} className="text-blue-500">
                            {" "}
                            https://muasamcong.mpi.gov.vn{" "}
                        </Link>
                        Trong số này, chúng tôi cũng đã phân loại chia theo:
                    </p>
                    <ul className="list-inside list-disc">
                        <li>Số gói thầu đã đóng</li>
                        <li>Số gói thầu đang mở thầu</li>
                        <li>Số gói thầu mới đăng tải trong 24h</li>
                        <li>Số gói thầu mới có cập nhật/thay đổi trạng thái trong ngày</li>
                    </ul>
                </Col> */}
                <Col xs={24} sm={24} md={24} xl={12}>
                    <h3 className="mb-4 text-lg font-semibold">Quy mô và giá trị thị trường</h3>
                    <ul className="list-inside list-disc">
                        <li>
                            Ước tính tổng giá trị các hợp đồng được đấu thầu hàng năm (triệu/billion USD).
                        </li>
                        <li>
                            Tổng số gói thầu đã công bố trong năm qua.
                        </li>
                        <li>
                            Các ngành/lĩnh vực chính như xây dựng, giao thông, y tế, giáo dục, năng lượng, công nghệ thông tin.
                        </li>
                    </ul>
                </Col>
                <Col xs={24} sm={24} md={24} xl={12}>
                    <h3 className="mb-4 text-lg font-semibold">Phân loại theo phương thức đấu thầu</h3>
                    <ul className="list-inside list-disc">
                        <li>
                            Đấu thầu rộng rãi: Chiếm tỷ lệ lớn trong các dự án công hoặc dự án quốc tế.
                        </li>
                        <li>
                            Đấu thầu hạn chế: Áp dụng với các dự án yêu cầu công nghệ hoặc nhà thầu có kinh nghiệm chuyên sâu.
                        </li>
                        <li>
                            Chỉ định thầu: Thường gặp trong các dự án cấp bách hoặc đặc thù.
                        </li>
                        <li>
                            Đấu thầu qua mạng: Đang gia tăng mạnh, tiết kiệm chi phí và minh bạch hơn.
                        </li>
                    </ul>
                </Col>
                <Col xs={24} sm={24} md={24} xl={12}>
                    <h3 className="mb-4 text-lg font-semibold">Số lượng nhà thầu tham gia</h3>
                    <ul className="list-inside list-disc">
                        <li>
                            Doanh nghiệp trong nước: Chiếm tỷ lệ lớn, đặc biệt ở các lĩnh vực xây dựng và giao thông.
                        </li>
                        <li>
                            Doanh nghiệp nước ngoài: Thường tham gia vào các dự án lớn về năng lượng, cơ sở hạ tầng, công nghệ cao.
                        </li>
                        <li>
                            Nhà thầu nhỏ và vừa: Chủ yếu đấu thầu các dự án quy mô nhỏ hoặc phụ trợ.
                        </li>
                    </ul>
                </Col>
                <Col xs={24} sm={24} md={24} xl={12}>
                    <h3 className="mb-4 text-lg font-semibold">Các tiêu chí đánh giá phổ biến</h3>
                    <ul className="list-inside list-disc">
                        <li>
                            Giá dự thầu: Tiêu chí quan trọng nhất, chiếm 60-70% trọng số đánh giá.
                        </li>
                        <li>
                            Chất lượng và công nghệ: Ưu tiên trong các dự án yêu cầu kỹ thuật cao.
                        </li>
                        <li>
                            Tiến độ thực hiện: Đặc biệt quan trọng với các dự án xây dựng và công trình hạ tầng.
                        </li>
                        <li>
                            Kinh nghiệm: Nhà thầu có lịch sử thực hiện dự án tốt thường được ưu tiên.
                        </li>
                    </ul>
                </Col>
                <Col xs={24} sm={24} md={24} xl={12}>
                    <h3 className="mb-4 text-lg font-semibold">Các thách thức trong thị trường đấu thầu</h3>
                    <ul className="list-inside list-disc">
                        <li>
                            Minh bạch: Một số nơi vẫn xảy ra tình trạng ưu ái, thông thầu.
                        </li>
                        <li>
                            Cạnh tranh không lành mạnh: Bao gồm việc chào giá phá giá hoặc thiếu năng lực thực hiện.
                        </li>
                        <li>
                            Cập nhật công nghệ: Đấu thầu qua mạng cần cải thiện hơn để phổ biến và tối ưu.
                        </li>
                        <li>
                            Quản lý rủi ro: Chậm tiến độ hoặc thiếu kinh phí thực hiện.
                        </li>
                    </ul>
                </Col>
                <Col xs={24} sm={24} md={24} xl={12}>
                    <h3 className="mb-4 text-lg font-semibold">Xu hướng phát triển</h3>
                    <ul className="list-inside list-disc">
                        <li>
                            Đấu thầu qua mạng: Tăng cường sử dụng nền tảng số để đảm bảo minh bạch.
                        </li>
                        <li>
                            Hội nhập quốc tế: Các nhà thầu trong nước có xu hướng hợp tác với nhà thầu nước ngoài để tham gia dự án lớn.
                        </li>
                        <li>
                            Chuyển đổi số: Áp dụng trí tuệ nhân tạo (AI) và dữ liệu lớn (Big Data) trong việc đánh giá, phân tích hồ sơ dự thầu.
                        </li>
                        <li>
                            Tăng cường đào tạo: Các nhà thầu được hỗ trợ nâng cao năng lực để đáp ứng tiêu chuẩn quốc tế.
                        </li>
                    </ul>
                </Col>
            </Row>
        </div>
    )
}

export default Overview