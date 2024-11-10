import React, { useState, useEffect } from "react";
import imageError from "@/assets/images/imgError-table.jpg";
import imgEmpty from "@/assets/images/image-empty.png";

interface ImageProps {
    src: string;
    alt: string;
    description?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, description }) => {
    const [imgSrc, setImgSrc] = useState<string>(src);

    useEffect(() => {
        if (!imgSrc || imgSrc.trim() === "") {
            setImgSrc(imgEmpty);
        } else {
            setImgSrc(imgSrc);
        }
    }, [imgSrc]);

    const handleError = () => {
        setImgSrc(imageError);
    };

    return (
        <div className="flex items-center gap-2 p-2">
            {!imgSrc ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-50">
                </div>
            ) : (
                <img src={`${import.meta.env.VITE_API_URL}/${src}` || imgSrc} alt={alt} onError={handleError} className=" h-20 w-20 rounded-lg bg-gray-50 object-cover" />
            )}
            <div className="flex flex-col gap-1">
                <div className="text-s-regular text-gray-500">{description}</div>
            </div>
        </div>
    );
};

export default Image;
