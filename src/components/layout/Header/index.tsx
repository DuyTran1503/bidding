import { RootStateType } from "@/services/reducers";
import { Image } from "antd";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaCaretDown, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ChildMenuItem from "./ChildMenuItem";
import { menu } from "./menu";

interface HeaderProps {
  systemData: any;  // Thêm kiểu dữ liệu cho props
}
const Header: React.FC<HeaderProps> = ({ systemData }) => {
  const isLoggedIn = useSelector((state: RootStateType) => state.auth.isLogin);
  const userProfile = useSelector((state: RootStateType) => state.auth.profile);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const parentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    // Hàm này không có tác dụng gì, bạn có thể bỏ đi nếu không cần
    document.body.clientWidth;
  }, []);

  const handleMenuClick = (path: string | undefined) => {
    if (path) navigate(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-11">
      <header className="fixed top-0 left-0 w-full shadow-md p-2 z-50 bg-cyan-600">
        <div className="flex w-full max-w-screen-xl mx-4 xl:mx-auto items-center justify-between">
          <Link to="/" className="flex justify-center items-center font-medium text-white gap-2 hover:text-gray-200 uppercase">
            <Image src={systemData?.logo} preview={false} alt="Logo" className="!w-10" /> {systemData?.name}
          </Link>

          {/* Mobile menu toggle button */}
          <button
            className="lg:hidden text-white"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Desktop menu */}
          <ul className="hidden lg:flex h-full items-center">
            {menu.map((menuData, index) => (
              <li
                ref={parentRef}
                key={index}
                className="group relative flex h-full cursor-pointer px-4 items-center text-white hover:text-gray-300 transition-all"
                onClick={() => handleMenuClick(menuData.path)}
              >
                <div className="flex items-center gap-2 uppercase">
                  <span>{menuData.label}</span>
                  {menuData.items && <FaCaretDown />}
                </div>

                {/* Child Menu Level 1 */}
                {menuData.items && (
                  <ul className="absolute left-0 top-full z-10 hidden w-72 bg-white text- black py-2 shadow-lg group-hover:block">
                    {menuData.items.map((item, index) => (
                      <ChildMenuItem key={index} {...item} group="group/1">
                        {/* Child Menu Level 2 */}
                        {item.items && (
                          <ul className="absolute left-full top-0 hidden w-72 bg-white py-2 shadow-lg group-hover:block">
                            {item.items.map((subItem, index) => (
                              <ChildMenuItem key={index} {...subItem} group="group/2">
                                {/* Child Menu Level 3 */}
                                {subItem.items && (
                                  <ul className="absolute left-full top-0 hidden w-72 bg-white py-2 shadow-lg group-hover:block">
                                    {subItem.items.map((subSubItem, index) => (
                                      <ChildMenuItem key={index} {...subSubItem} group="group/3" />
                                    ))}
                                  </ul>
                                )}
                              </ChildMenuItem>
                            ))}
                          </ul>
                        )}
                      </ChildMenuItem>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <ul className="lg:hidden absolute left-0 top-14 w-full bg-cyan-600 text-white py-4">
              {menu.map((menuData, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-cyan-500"
                  onClick={() => handleMenuClick(menuData.path)}
                >
                  <div className="flex items-center gap-2">
                    <span>{menuData.label}</span>
                    {menuData.items && <FaCaretDown />}
                  </div>

                  {/* Child Menu Level 1 */}
                  {menuData.items && (
                    <ul className="pl-4 ">
                      {menuData.items.map((item, index) => (
                        <ChildMenuItem key={index} {...item} group="group/1">
                          {/* Child Menu Level 2 */}
                          {item.items && (
                            <ul className="pl-4">
                              {item.items.map((subItem, index) => (
                                <ChildMenuItem key={index} {...subItem} group="group/2">
                                  {/* Child Menu Level 3 */}
                                  {subItem.items && (
                                    <ul className="pl-4">
                                      {subItem.items.map((subSubItem, index) => (
                                        <ChildMenuItem key={index} {...subSubItem} group="group/3" />
                                      ))}
                                    </ul>
                                  )}
                                </ChildMenuItem>
                              ))}
                            </ul>
                          )}
                        </ChildMenuItem>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <p className="text-white hidden lg:flex">Chào, {userProfile?.name || "Người dùng"}!</p>
              <Link
                to="/dashboard"
                className="h-full flex items-center justify-center text-white hover:text-gray-200 font-medium transition-all"
              >
                Trang Admin
              </Link>
            </div>
          ) : (
            <Link to="/auth/login" className="text-blue-600 hover:text-blue-800 px-4 py-1 sm:py-2 bg-white font-semibold rounded-md">
              Đăng nhập
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
