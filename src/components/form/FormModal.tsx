import React from "react";
import { Modal } from "antd";

interface IFormModalProps {
    title?: string;
    open: boolean; // Đổi tên từ isopen thành open
    onOk?: () => void;
    onCancel?: () => void;
    okText?: string;
    cancelText?: string;
    isOkDisabled?: boolean;
    isCancelDisabled?: boolean;
    children?: React.ReactNode;
}

const FormModal = ({
    title,
    open,
    onOk,
    onCancel,
    okText = "OK",
    cancelText = "Cancel",
    isOkDisabled = false,
    isCancelDisabled = false,
    children,
}: IFormModalProps) => {
    return (
        <Modal
            title={title}
            open={open} // Sử dụng visible thay vì isVisible
            onOk={onOk}
            onCancel={onCancel}
            okText={okText}
            cancelText={cancelText}
            okButtonProps={{ disabled: isOkDisabled }}
            cancelButtonProps={{ disabled: isCancelDisabled }}
        >
            {children}
        </Modal>
    );
};

export default FormModal;