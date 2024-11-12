import React from 'react';
import { Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';

interface LoadingSpinnerProps extends SpinProps {
    // Optional custom message to display below the spinner
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, ...spinProps }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Spin {...spinProps} />
            {message && <div style={{ marginTop: 10 }}>{message}</div>}
        </div>
    );
};

export default LoadingSpinner;
