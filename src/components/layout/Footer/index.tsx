// import TopBar from "./TopBar"

import { Link } from "react-router-dom"

const Footer = () => {
    return <footer className="flex items-center justify-between px-4 h-20 bg-gray-800 text-white mt-8 text-sm">
        <div>
            <ul className="flex gap-5">
                <li><Link to={`/`} className="hover:text-gray-400">Trang chủ</Link></li>
                <li><Link to={`/introduce`} className="hover:text-gray-400">Giới thiệu</Link></li>
                <li><Link to={`/`} className="hover:text-gray-400">Dịch vụ</Link></li>
                <li><Link to={`/`} className="hover:text-gray-400">Tin tức</Link></li>
                <li><Link to={`/`} className="hover:text-gray-400">Liên hệ</Link></li>
            </ul>
        </div>
        <div>
            <h3>@SEPTENARY SOLUTION</h3>
        </div>
    </footer>
}

export default Footer