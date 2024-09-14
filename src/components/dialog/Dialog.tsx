import { Modal } from 'antd';
import React from 'react';

interface IProps {
  title?: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  children: React.ReactNode;
  className?: string;
  footerContent?: React.ReactNode;
  handleSubmit: (e: any) => void;
}

const Dialog = (props: IProps) => {
  const { title, visible, setVisible, children, className, footerContent, handleSubmit } = props;

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => setVisible(false)}
      footer={footerContent}
      className={className}
      maskClosable={true}
      destroyOnClose={true} // To unmount modal content when closed
    >
      {children}
    </Modal>
  );
};

export default Dialog;
