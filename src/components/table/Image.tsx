import React, { useState, useEffect } from "react";
import imageError from "@/assets/images/imgError-table.jpg";
import imgEmpty from "@/assets/images/image-empty.png";

interface ImageProps {
    imageSrc?: string;
    description?: string;
}

const Image: React.FC<ImageProps> = ({ imageSrc, description }) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!imageSrc || imageSrc.trim() === "") {
            setImgSrc(imgEmpty);
        } else {
            setImgSrc(imageSrc);
        }
    }, [imageSrc]);

    const handleError = () => {
        setImgSrc(imageError);
    };

    return (
        <div className="flex items-center gap-2 p-2">
            {!imgSrc ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-50">
                </div>
            ) : (
                <img src={imgSrc} onError={handleError} className=" h-20 w-20 rounded-lg bg-gray-50 object-cover" alt="" />
            )}
            <div className="flex flex-col gap-1">
                <div className="text-s-regular text-gray-500">{description}</div>
            </div>
        </div>
    );
};

export default Image;
