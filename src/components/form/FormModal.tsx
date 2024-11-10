import React from "react";
import { Modal, Button } from "antd";

interface IFormModalProps {
  title?: string;
  open: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
  isCancelDisabled?: boolean;
  children?: React.ReactNode;
}

const FormModal = ({
  title,
  open,
  onConfirm,
  onCancel,
  cancelText = "Hủy",
  submitText = "Ok",
  isCancelDisabled = false,
  children,
}: IFormModalProps) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" type="default" onClick={onCancel} disabled={isCancelDisabled}>
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" onClick={onConfirm}>
          {submitText}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};

export default FormModal;
