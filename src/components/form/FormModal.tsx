import React from "react";
import { Modal, Button } from "antd";

interface IFormModalProps {
  title?: string;
  open: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  cancelText?: string;
  isCancelDisabled?: boolean;
  children?: React.ReactNode;
  submitText?: string;
}

const FormModal = ({ title, open, onCancel, cancelText = "Cancel", isCancelDisabled = false, children }: IFormModalProps) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={
        <Button type="default" onClick={onCancel} disabled={isCancelDisabled}>
          {cancelText}
        </Button>
      }
    >
      {children}
    </Modal>
  );
};

export default FormModal;
