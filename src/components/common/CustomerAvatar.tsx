import React, { useState } from "react";
import clsx from "clsx";
import imageError from "@/assets/images/default-featured-image.png";
import imgFbDefault from "@/assets/images/customerDefaultAvatar.png";

interface CustomerAvatarProps {
  src: string;
  alt: string;
  className?: string;
  size?: "large" | "medium";
}

const CustomerAvatar: React.FC<CustomerAvatarProps> = ({ src, alt, className, size = "medium" }) => {
  const [imageSrc, setImageSrc] = useState<string>(
    src && src.trim() !== "" ? src : imgFbDefault
  );

  const handleImageError = () => {
    setImageSrc(imageError);
  };

  // Tạo URL đầy đủ nếu cần thiết
  const fullImageSrc =
    imageSrc.startsWith("http://") || imageSrc.startsWith("https://")
      ? imageSrc
      : `${import.meta.env.VITE_API_URL}/${imageSrc}`;

  return (
    <img
      src={fullImageSrc}
      alt={alt}
      className={clsx("object-cover", className, {
        "h-auto w-auto": size === "medium",
        "h-16 w-16": size === "large", // Ví dụ: bạn có thể điều chỉnh theo kích thước
      })}
      onError={handleImageError}
    />
  );
};

export default CustomerAvatar;
