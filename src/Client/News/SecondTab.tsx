import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";

const SecondTab = () => {
  const columns: ColumnsType = [
    {
      key: "ten-khlcnt",
      title: "Tên KHLCNT",
      align: "center",
    },
    {
      key: "ben-moi-thau",
      title: "Bên mời thầu",
      align: "center",
    },
    {
      key: "cong-bo",
      title: "Công bố",
      align: "center",
    },
    {
      key: "goi-thau",
      title: "Gói thầu",
      align: "center",
    },
  ];

  return (
    <>
      <Table columns={columns} />
      <div className="mt-4 flex justify-between">
        <Button children="Thông báo mời thầu" type="primary" size="large" />
        <Button children="Xem thêm" danger type="primary" size="large" />
      </div>
    </>
  );
};

export default SecondTab;
