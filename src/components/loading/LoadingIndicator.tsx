import React from "react";
import { ThreeDot } from "react-loading-indicators";

const LoadingIndicator: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div style={{ 
        display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", 
        top: 0, left: 0, width: "100%", height: "100vh", backgroundColor: "rgba(255, 255, 255, 0.7)", zIndex: 1000 
        }}>
      <ThreeDot color="#1890ff" />
    </div>
  );
};

export default LoadingIndicator;
