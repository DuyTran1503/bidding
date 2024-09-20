import { Modal } from "antd";
import React from "react";

interface IProps {
  title?: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  children: React.ReactNode;
  className?: string;
  footerContent?: React.ReactNode;
  handleSubmit?: (e: any) => void;
  screenSize?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | string; // Added screenSize prop
}

const Dialog = (props: IProps) => {
  const { title, visible, setVisible, children, className, footerContent, handleSubmit, screenSize } = props;

  // Determine maximum width based on screen size
  const maxWidthMap: Record<string, string> = {
    xs: "412px", // Max-width for xs
    sm: "400px", // Max-width for sm
    md: "600px", // Max-width for md
    lg: "800px", // Max-width for lg
    xl: "980px", // Max-width for xl
    xxl: "1200px", // Max-width for xxl
  };

  const maxWidth = maxWidthMap[screenSize!] || "calc(100% - 12px)"; // Default to '600px' if unrecognized screenSize

  // Set height based on screen size
  // const height = screenSize && ['lg', 'xl', 'xxl'].includes(screenSize) ? '100vh' : 'auto';

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    if (handleSubmit) {
      handleSubmit(e);
    }
    setVisible(false); // Close modal on submit
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
      footer={footerContent} // Đặt footer thành null để sử dụng footer tùy chỉnh
      className={className}
      maskClosable={true}
      destroyOnClose={true}
      width={maxWidth}
      style={{ width: "100%", maxWidth, top: 0 }} // Chiều cao modal
    >
      <div className="pb-4">{children}</div>
      {/* <div
        style={{ width: maxWidth }}
        className={` m-auto fixed bottom-0 left-0 right-0 h-[3.3rem] bg-white border-t border-gray-200 flex justify-center items-center z-1`}>
        {footerContent}
      </div> */}
    </Modal>
  );
};

export default Dialog;
