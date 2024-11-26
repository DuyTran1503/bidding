import { Button, ConfigProvider, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";

const FirstTab = () => {
  const columns: ColumnsType = [
    {
      key: "goi-thau",
      dataIndex: "goi-thau",
      title: "Gói thầu",
      align: "center",
    },
    {
      key: "ben-moi-thau",
      dataIndex: "ben-moi-thau",
      title: "Bên mời thầu",
      align: "center",
    },
    {
      key: "cong-bo",
      dataIndex: "cong-bo",
      title: "Công bố",
      align: "center",
    },
    {
      key: "dong-thau",
      dataIndex: "dong-thau",
      title: "Đóng thầu",
      align: "center",
    },
  ];

  // Type lai sau nha
  const data: any[] = [
    {
      "goi-thau": (
        <Link
          to="/"
          children="Gói thầu số 01: Trang bị hệ điều hành và phần mềm Microsoft Office có bản quyền"
          className="hover:text-blue-600 text-blue-500"
        />
      ),
      "ben-moi-thau": <Link to="/" children="Trung tâm Tin học thành phố Cao Lãnh" className="hover:text-blue-600 text-blue-500" />,
      "cong-bo": "21:08 17/09/2024",
      "dong-thau": "09:00 24/09/2024",
    },
    {
      "goi-thau": (
        <Link
          to="/"
          children="Gói thầu số 01: Trang bị hệ điều hành và phần mềm Microsoft Office có bản quyền"
          className="hover:text-blue-600 text-blue-500"
        />
      ),
      "ben-moi-thau": (
        <Link to="/" children="CÔNG TY TNHH TƯ VẤN ĐẦU TƯ XÂY DỰNG THƯƠNG MẠI KỶ NGUYÊN" className="hover:text-blue-600 text-blue-500" />
      ),
      "cong-bo": "21:08 17/09/2024",
      "dong-thau": "09:00 24/09/2024",
    },
    {
      "goi-thau": (
        <Link
          to="/"
          children="Gói thầu số 01: Trang bị hệ điều hành và phần mềm Microsoft Office có bản quyền"
          className="hover:text-blue-600 text-blue-500"
        />
      ),
      "ben-moi-thau": <Link to="/" children="CÔNG TY TNHH MTV ATA AN PHÁT" className="hover:text-blue-600 text-blue-500" />,
      "cong-bo": "21:08 17/09/2024",
      "dong-thau": "09:00 24/09/2024",
    },
    {
      "goi-thau": (
        <Link
          to="/"
          children="Gói thầu số 01: Trang bị hệ điều hành và phần mềm Microsoft Office có bản quyền"
          className="hover:text-blue-600 text-blue-500"
        />
      ),
      "ben-moi-thau": <Link to="/" children="CÔNG TY TNHH XÂY DỰNG DỊCH VỤ GIA HƯNG THỊNH" className="hover:text-blue-600 text-blue-500" />,
      "cong-bo": "21:08 17/09/2024",
      "dong-thau": "09:00 24/09/2024",
    },
    {
      "goi-thau": (
        <Link
          to="/"
          children="Gói thầu số 01: Trang bị hệ điều hành và phần mềm Microsoft Office có bản quyền"
          className="hover:text-blue-600 text-blue-500"
        />
      ),
      "ben-moi-thau": <Link to="/" children="CÔNG TY TRÁCH NHIỆM HỮU HẠN TÂN KHỞI QUẢNG TRỊ" className="hover:text-blue-600 text-blue-500" />,
      "cong-bo": "21:08 17/09/2024",
      "dong-thau": "09:00 24/09/2024",
    },
    {
      "goi-thau": (
        <Link
          to="/"
          children="Gói thầu số 01: Trang bị hệ điều hành và phần mềm Microsoft Office có bản quyền"
          className="hover:text-blue-600 text-blue-500"
        />
      ),
      "ben-moi-thau": (
        <Link to="/" children="BAN QUẢN LÝ DỰ ÁN ĐẦU TƯ XÂY DỰNG HUYỆN SƠN DƯƠNG" className="hover:text-blue-600 text-blue-500" />
      ),
      "cong-bo": "21:08 17/09/2024",
      "dong-thau": "09:00 24/09/2024",
    },
    {
      "goi-thau": (
        <Link
          to="/"
          children="Gói thầu số 01: Trang bị hệ điều hành và phần mềm Microsoft Office có bản quyền"
          className="hover:text-blue-600 text-blue-500"
        />
      ),
      "ben-moi-thau": <Link to="/" children=" Cục Xe Máy/ Tổng cục Kỹ thuật" className="hover:text-blue-600 text-blue-500" />,
      "cong-bo": "21:08 17/09/2024",
      "dong-thau": "09:00 24/09/2024",
    },
    {
      "goi-thau": (
        <Link
          to="/"
          children="Gói thầu số 01: Trang bị hệ điều hành và phần mềm Microsoft Office có bản quyền"
          className="hover:text-blue-600 text-blue-500"
        />
      ),
      "ben-moi-thau": <Link to="/" children="CÔNG TY TNHH CÔNG NGHỆ ĐIỆN TỬ TIN HỌC" className="hover:text-blue-600 text-blue-500" />,
      "cong-bo": "21:08 17/09/2024",
      "dong-thau": "09:00 24/09/2024",
    },
    {
      "goi-thau": (
        <Link
          to="/"
          children="Gói thầu số 01: Trang bị hệ điều hành và phần mềm Microsoft Office có bản quyền"
          className="hover:text-blue-600 text-blue-500"
        />
      ),
      "ben-moi-thau": <Link to="/" children="TỔNG CÔNG TY ĐÔNG BẮC" className="hover:text-blue-600 text-blue-500" />,
      "cong-bo": "21:08 17/09/2024",
      "dong-thau": "09:00 24/09/2024",
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#3b7bff",
            headerColor: "white",
          },
        },
      }}
    >
      <Table columns={columns} dataSource={data} pagination={false} bordered/>
      <div className="mt-4 flex justify-between">
        <Button children="Kế hoach lựa chọn nhà thầu" type="primary" size="large" />
        <Button children="Xem thêm" danger type="primary" size="large" />
      </div>
    </ConfigProvider>
  );
};

export default FirstTab;
