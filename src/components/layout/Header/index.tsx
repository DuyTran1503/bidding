import { Link } from "react-router-dom";
import logo from "@/assets/images/logo.png"; // Ảnh đã xóa nền
import { useSelector } from "react-redux";
import { RootStateType } from "@/services/reducers";
import { Image } from "antd";

const Header: React.FC = () => {

  const isLoggedIn = useSelector((state: RootStateType) => state.auth.isLogin);
  const userProfile = useSelector((state: RootStateType) => state.auth.profile);

  return (
    <div className="h-14">
      <header className="fixed top-0 left-0 w-full shadow-md p-4 z-50 flex h-14 items-center justify-between bg-cyan-600 px-4">
        <Link to="/" className="flex justify-center items-center font-medium text-white gap-2 hover:text-gray-200">
          <Image src={logo} preview={false} alt="Logo" className="!w-10" /> SEPTENARY SOLUTION
        </Link>
        <ul className="h-full flex uppercase text-sm">
          <li className="h-full flex items-center justify-center text-white hover:text-gray-200 font-medium transition-all">
            <Link to={`/`} className="px-4">Trang chủ</Link>
          </li>
          <li className="h-full flex items-center justify-center text-white hover:text-gray-200 font-medium transition-all">
            <Link to={`/introduce`} className="px-4">Giới thiệu</Link>
          </li>
          <li className="h-full flex items-center justify-center text-white hover:text-gray-200 font-medium transition-all">
            <Link to={`/`} className="px-4">Tin tức</Link>
          </li>
          <li className="h-full flex items-center justify-center text-white hover:text-gray-200 font-medium transition-all">
            <Link to={`/`} className="px-4">Hướng dẫn</Link>
          </li>
          <li className="h-full flex items-center justify-center text-white hover:text-gray-200 font-medium transition-all">
            <Link to={`/`} className="px-4">Liên hệ & Hỗ trợ</Link>
          </li>
        </ul>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <p className="text-gray-700">Chào, {userProfile?.name || "Người dùng"}!</p>
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="h-full flex items-center justify-center text-white hover:text-gray-200 font-medium transition-all"
              >
                Admin
              </Link>
            )}
          </div>
        ) : (
          <Link to={`auth/login`} className="text-blue-600 hover:text-blue-800">Đăng nhập</Link>
        )}
      </header>
    </div>
  )
}

export default Header