import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png"; // Ảnh đã xóa nền
import { useSelector } from "react-redux";
import { RootStateType } from "@/services/reducers";
import { Image } from "antd";
import { useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import ChildMenuItem from "./ChildMenuItem";
import { menu } from "./menu";

const Header: React.FC = () => {
  const isLoggedIn = useSelector((state: RootStateType) => state.auth.isLogin);
  const userProfile = useSelector((state: RootStateType) => state.auth.profile);
  const navigate = useNavigate();
  const parentRef = useRef<HTMLLIElement>(null);
  const firstChildRef = useRef<HTMLUListElement>(null);
  const secondChild = useRef<HTMLUListElement>(null);
  const thirdChild = useRef<HTMLUListElement>(null);

  useEffect(() => {
    document.body.clientWidth;
  });

  return (
    <div className="h-14">
      <header className="fixed top-0 left-0 w-full shadow-md p-4 z-50 flex h-14 items-center justify-between bg-cyan-600">
        <Link to="/" className="flex justify-center items-center font-medium text-white gap-2 hover:text-gray-200">
          <Image src={logo} preview={false} alt="Logo" className="!w-10" /> SEPTENARY SOLUTION
        </Link>

        <ul className="flex h-full items-center">
          {menu.map((menuData, index) => (
            <li
              ref={parentRef}
              key={index}
              className="group/root relative flex h-full cursor-pointer px-4 items-center text-white hover:text-gray-300 transition-all"
              onClick={() => {
                if (menuData.path) navigate(menuData.path);
              }}
            >
              <div className="flex items-center gap-2 uppercase">
                <span>{menuData.label}</span>
                {menuData.items && <FaCaretDown />}
              </div>

              {/* Child Menu Level 1 */}
              {menuData.items && (
                <ul
                  ref={firstChildRef}
                  className="absolute left-0 top-full z-10 hidden w-72 bg-white py-2 shadow-lg group-hover/root:block"
                >
                  {menuData.items?.map((menuData, index) => (
                    <ChildMenuItem key={index} {...menuData} group="group/1">
                      {/* Child Menu Level 2 */}
                      {menuData.items && (
                        <ul
                          ref={secondChild}
                          className="absolute left-full top-0 hidden w-72 bg-white py-2 shadow-lg group-hover/1:block"
                        >
                          {menuData.items?.map((menuData, index) => (
                            <ChildMenuItem key={index} {...menuData} group="group/2">
                              {/* Child Menu Level 3 */}
                              {menuData.items && (
                                <ul
                                  ref={thirdChild}
                                  className="absolute left-full top-0 hidden w-72 bg-white py-2 shadow-lg group-hover/2:block"
                                >
                                  {menuData.items?.map((menuData, index) => (
                                    <ChildMenuItem key={index} {...menuData} group="group/3" />
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
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <p className="text-white">Chào, {userProfile?.name || "Người dùng"}!</p>
            <Link
              to="/dashboard"
              className="h-full flex items-center justify-center text-white hover:text-gray-200 font-medium transition-all"
            >
              Admin
            </Link>
          </div>
        ) : (
          <Link to="/auth/login" className="text-blue-600 hover:text-blue-800 px-4 py-2 bg-white font-semibold rounded-md">
            Đăng nhập
          </Link>
        )}
      </header>
    </div>
  )
}

export default Header