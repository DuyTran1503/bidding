import React from "react";
import { ITableData } from "@/components/table/PrimaryTable";
import { Row, Col } from "antd"; // Giả sử bạn đang sử dụng Ant Design
import FormInput from "@/components/form/FormInput";
import FormInputArea from "@/components/form/FormInputArea";

interface DetailActivityLogProps {
  record: ITableData;
}

const Detail: React.FC<DetailActivityLogProps> = ({ record }) => {
  return (
    <div className="bg-white p-6">
      <h2 className="mb-4 text-2xl font-semibold">Chi tiết loại hình hoạt động</h2>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
          <FormInput type="text" isDisabled={true} label="Tên nhật ký" value={record?.log_name as string} name="log_name" />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
          <FormInput type="text" isDisabled={true} label="Người thực hiện" value={record?.action_performer as string} name="action_performer" />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
          <FormInput type="text" isDisabled={true} label="Hành động" value={record?.event as string} name="event" />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={24} xl={24} className="mb-4">
          <FormInputArea label="Mô tả" isReadonly value={record?.description as string} />
        </Col>
      </Row>
    </div>
  );
};

export default Detail;
