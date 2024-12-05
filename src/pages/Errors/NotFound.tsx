import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NOTFOUND from '@/assets/images/Image_error/404.jpg';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (eyeRef.current && pupilRef.current) {
        const eye = eyeRef.current.getBoundingClientRect();
        const pupil = pupilRef.current.getBoundingClientRect();
        
        const eyeCenterX = eye.left + eye.width / 2;
        const eyeCenterY = eye.top + eye.height / 2;
        
        const radian = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);
        
        const radius = (eye.width - pupil.width) / 4;
        
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
      <div className="flex flex-col-reverse md:flex-row  items-center justify-evenly max-w-7xl gap-1 md:gap-8">
        <div className="flex flex-col items-center  md:w-1/2">
          <div className="text-5xl md:text-8xl font-bold relative">
            4
            <span className="inline-block mx-1 md:mx-2 relative">
              <div 
                ref={eyeRef}
                className="w-8 h-8 md:w-16 md:h-16 bg-white rounded-full border-2 md:border-4 border-gray-800 relative overflow-hidden"
              >
                <div
                  ref={pupilRef}
                  className="w-3 h-3 md:w-6 md:h-6 bg-gray-800 rounded-full absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
              </div>
            </span>
            4
          </div>

          <div className="space-y-2 md:space-y-4 mt-4">
            <h2 className="text-md md:text-2xl font-semibold text-gray-700">
              Trang bạn tìm kiếm không tồn tại
            </h2>
            <button
              onClick={handleGoBack}
              className="px-4 py-[6px] font-semibold md:px-6 md:py-3 text-white bg-blue-500 rounded-full hover:bg-blue-600 hover:text-white transition "
            >
              Quay về trang trước
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img 
            src={NOTFOUND} 
            alt="Not Found" 
            className="w-full max-w-xs lg:max-w-xl xl:max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;