import React from "react";
import { Modal } from "antd";

interface IFormModalProps {
    title?: string;
    open: boolean;
    onSubmit?: () => void;
    onCancel?: () => void;
    submitText?: string;
    cancelText?: string;
    isSubmitDisabled?: boolean;
    isCancelDisabled?: boolean;
    children?: React.ReactNode;
}

const FormModal = ({
    title,
    open,
    onSubmit,
    onCancel,
    submitText = "SUBMIT",
    cancelText = "Cancel",
    isSubmitDisabled = false,
    isCancelDisabled = false,
    children,
}: IFormModalProps) => {
    return (
        <Modal
            title={title}
            open={open}
            onOk={onSubmit}
            onCancel={onCancel}
            okText={submitText}
            cancelText={cancelText}
            okButtonProps={{ disabled: isSubmitDisabled }}
            cancelButtonProps={{ disabled: isCancelDisabled }}
        >
            {children}
        </Modal>
    );
};

export default FormModal;
