import Logo from "@/components/common/Logo";
import { Link } from "react-router-dom";

const Success = () => {
    return (
        <section className="bg-gradient-to-tl from-blue-500 to-cyan-300">
            <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
                <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
                    <div className="flex flex-col gap-5 p-8">
                        <a href="/" className="flex justify-center">
                            <Logo />
                        </a>
                        <h1 className="text-gray-900 display-m-bold md:text-xl-semibold text-center">
                            Gửi yêu thành công
                        </h1>
                        <p className="p-2 border rounded-md text-sm shadow text-gray-300">
                            Vui lòng kiểm tra lại Email và ấn vào nút tại đây để đổi mật khẩu!
                            <br />
                            Nếu đã đổi mật khẩu thành công vui lòng quay lại trang 
                            <Link
                                to="/auth/login"
                                className="ml-1 cursor-pointer text-end font-normal text-cyan-600 transition-colors hover:text-cyan-500"
                            > đăng nhập </Link>
                        </p>
                        <Link
                            to="/auth/login"
                            className="cursor-pointer text-end font-normal text-cyan-600 transition-colors hover:text-cyan-500"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Success