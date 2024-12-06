import logo from "@/assets/images/logo.png";
import logoVietFuture from "@/assets/images/logoVietFuture.png";
import { Image } from "antd";
import { FaFacebookF } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { Link } from "react-router-dom"

const Footer = () => {
    return <footer className=" bg-gray-800 text-gray-300 mt-8 py-4">
        <div className=" max-w-screen-xl mx-4 xl:mx-auto space-y-4">
            <div className="flex gap-x-4">
                <Link to="/" className="text-center font-bold text-xl gap-2 hover:text-gray-200">
                    <Image src={logo} preview={false} alt="Logo" className="!w-16" />
                    <p className="text-nowrap">SEPTENARY SOLUTION</p>
                </Link>
                <div>
                    <h1 className="text-xl font-bold">Website biểu đồ hóa dữ liệu đấu thầu mua sắm công</h1>
                    <p className="text-sm">
                        septenarysolution.site là website phân tích thông tin mời thầu thế hệ mới dành cho doanh nghiệp, biểu đồ hóa dữ liệu đấu thầu,
                        giúp doanh nghiệp tìm kiếm, phân tích thông tin về các dự án đấu thầu mua sắm công và mua sắm tư nhân trên cả nước.
                    </p>
                </div>
                <div className="text-center font-bold space-y-2">
                    <p className="text-xl whitespace-nowrap">Kết nối</p>
                    <ul className="flex gap-4">
                        <li>
                            <Link
                                to={`https://www.facebook.com/profile.php?id=61561550069529`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-600 text-gray-300 hover:text-gray-100 rounded-full  p-3 flex items-center justify-center transition"
                            >
                                <FaFacebookF />
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`https://zalo.me/0338475943`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-600 text-gray-300 hover:text-gray-100 rounded-full  p-3 flex items-center justify-center transition"
                            >
                                <SiZalo />
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
            <hr className="border-t-2 border-black-300 my-4" />
            <div className="flex justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-nowrap mb-4">Dành cho doanh nghiệp</h1>
                    <ul className="">
                        <li><Link to={`/`} className="hover:text-gray-400">Thông báo mời thầu</Link></li>
                        <li><Link to={`/introduce`} className="hover:text-gray-400">Kết quả đấu thầu</Link></li>
                        <li><Link to={`/news`} className="hover:text-gray-400">So sánh thông tin dự án</Link></li>
                        <li><Link to={`/`} className="hover:text-gray-400">So sánh thông tin doanh nghiệp</Link></li>
                        <li><Link to={`/`} className="hover:text-gray-400">Tìm kiếm thông tin dự án</Link></li>
                    </ul>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-nowrap mb-4">Dịch vụ của chúng tôi</h1>
                    <ul className="">
                        <li><Link to={`/`} className="hover:text-gray-400">Phân tích quan hệ thầu</Link></li>
                        <li><Link to={`/`} className="hover:text-gray-400">Phân tích tình trạng thầu</Link></li>
                        <li><Link to={`/introduce`} className="hover:text-gray-400">Biểu đồ hóa</Link></li>
                        <li><Link to={`/news`} className="hover:text-gray-400">Tra cứu thông tin thầu</Link></li>
                        <li><Link to={`/`} className="hover:text-gray-400">Quản lý bộ lọc</Link></li>
                    </ul>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-nowrap mb-4">Tiện ích</h1>
                    <ul className="">
                        <li><Link to={`/introduce`} className="hover:text-gray-400">Về chúng tôi</Link></li>
                        <li><Link to={`/news`} className="hover:text-gray-400">Tin tức</Link></li>
                        <li><Link to={`/support`} className="hover:text-gray-400">Liên hệ</Link></li>
                        <li><Link to={`/instruct`} className="hover:text-gray-400">Hướng dẫn</Link></li>
                        <li><Link to={`/support/create`} className="hover:text-gray-400">Đăng ký cấp tài khoản</Link></li>
                    </ul>
                </div>
                <div className="max-w-[350px]">
                    <Link to="/" className=" flex items-center gap-2 font-medium text-white hover:text-gray-200">
                        <Image src={logo} preview={false} alt="Logo" className="!w-12" />
                        <strong>SEPTENARY SOLUTION</strong>
                    </Link>
                    <p>Thực hiện bởi nhóm: <strong>SEPTENARY SOLUTION</strong></p>
                    <p>Địa chỉ: Tòa nhà FPT Polytechnic., Cổng số 2, 13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội</p>
                    <p>Hotline: 0702208708 hoặc 0338475943</p>
                    <p>Email: septenarysolution@gmail.com</p>
                </div>
                <div className="w-56">
                    <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        to="https://vietfuture.world/"
                        className=" flex items-center gap-2 font-medium text-white hover:text-gray-200">
                        <Image src={logoVietFuture} preview={false} alt="logoVietFuture" className="!w-8" />
                        <strong>VIETFUTURE</strong>
                    </Link>
                    <p>Sản phẩm đã được tham gia <strong className="text-sm">Vòng Chung kết toàn quốc Giải thưởng Sáng tạo Tương lai - VietFuture 2024</strong></p>
                </div>
            </div>
            {/* <div className="flex items-center justify-between h-20text-sm">
            <ul className="flex gap-5">
                <li><Link to={`/`} className="hover:text-gray-400">Trang chủ</Link></li>
                <li><Link to={`/introduce`} className="hover:text-gray-400">Giới thiệu</Link></li>
                <li><Link to={`/news`} className="hover:text-gray-400">Tin tức</Link></li>
                <li><Link to={`/`} className="hover:text-gray-400">Liên hệ</Link></li>
            </ul>
        </div> */}
            {/* <div>
            <h3>@SEPTENARY SOLUTION</h3>
        </div> */}
        </div>
    </footer>
}

export default Footer