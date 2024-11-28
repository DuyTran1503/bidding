import logo from "@/assets/images/logo.png"; // Ảnh đã xóa nền
import { Image } from "antd";

const Logo = () => {
    return (
        <Image
            src={logo}
            preview={false}
            alt="Logo"
            className="!w-20"
        />
    );
};

export default Logo;
