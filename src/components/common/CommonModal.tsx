import React, { Dispatch, SetStateAction } from "react";
import { Modal, Button } from "antd";

interface IConfirmModalProps {
  title: string;
  content: React.ReactNode;
  onAbort?: () => void;
  onConfirm?: () => void;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const ConfirmModal: React.FC<IConfirmModalProps> = ({ title, content, onAbort, onConfirm, visible, setVisible }) => {
  const onClose = () => {
    setVisible(false);
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onClose();
            onAbort && onAbort();
          }}
        >
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={() => {
            onClose();
            onConfirm && onConfirm();
          }}
          danger
        >
          Đồng ý
        </Button>,
      ]}
      className="slide-in-down"
    >
      {content}
    </Modal>
  );
};

export default ConfirmModal;
