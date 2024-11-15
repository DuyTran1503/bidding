import React, { useEffect, useState } from "react";
import imageError from "@/assets/images/default-featured-image.png";
import clsx from "clsx";
import imgFbDefault from "@/assets/images/customerDefaultAvatar.png";

interface CustomerAvatarProps {
  src: string;
  alt: string;
  className?: string;
  size?: "large" | "medium";
}

const CustomerAvatar: React.FC<CustomerAvatarProps> = ({ size = "medium", src, alt, className }) => {
  const path = import.meta.env.VITE_API_URL;

  const [imageSrc, setImageSrc] = useState<string>(src);
  useEffect(() => {
    if (!imageSrc || imageSrc.trim() === "") {
      setImageSrc(imgFbDefault);
    } else {
      setImageSrc(imageSrc);
    }
  }, [imageSrc]);

  return (
    <img
      src={src.startsWith(path) ? src : `${import.meta.env.VITE_API_URL}/${src}` || imageSrc}
      alt={alt}
      className={clsx("rounded-circle object-cover", className, {
        "h-[80px] w-[80px]": size === "large",
        "h-[40px] w-[40px]": size === "medium",
      })}
      onError={() => {
        setImageSrc(imageError);
      }}
    />
  );
};

export default CustomerAvatar;
