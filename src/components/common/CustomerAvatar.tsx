import React, { useState, useEffect } from "react";
import clsx from "clsx";
import imageError from "@/assets/images/default-featured-image.png";
import imgFbDefault from "@/assets/images/customerDefaultAvatar.png";

interface CustomerAvatarProps {
  src: string;
  alt: string;
  className?: string;
  size?: "large" | "medium";
  avatar?: boolean;
}

const CustomerAvatar: React.FC<CustomerAvatarProps> = ({ src, alt, className, size = "medium", avatar = false }) => {
  const [imageSrc, setImageSrc] = useState<string>("");

  // Update imageSrc when src prop changes
  useEffect(() => {
    if (src && src.trim() !== "") {
      setImageSrc(src);
    }
  }, [src]);

  const handleImageError = () => {
    setImageSrc(imageError);
  };

  // Create full URL if necessary
  const fullImageSrc = imageSrc.startsWith("http://") || imageSrc.startsWith("https://") ? imageSrc : `${import.meta.env.VITE_API_URL}/${imageSrc}`;

  return (
    <img
      src={!src ? imgFbDefault : fullImageSrc}
      alt={alt}
      className={clsx("object-cover", className, {
        "h-auto w-auto": size === "medium",
        "h-16 w-16": size === "large",
        "h-15 w-15 rounded-full": avatar,
      })}
      onError={handleImageError}
    />
  );
};

export default CustomerAvatar;
