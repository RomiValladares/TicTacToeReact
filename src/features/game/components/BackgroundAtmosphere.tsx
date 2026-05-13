import React from 'react';

export const BackgroundAtmosphere: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="absolute w-0 h-0 invisible">
                <defs>
                    <filter id="goo" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                    </filter>
                </defs>
            </svg>

            <div className="w-full h-full" style={{ filter: 'url(#goo)' }}>
                <div className="atmosphere-blob top-[-20%] left-[-20%]" />
                <div className="atmosphere-blob right-[-10%] bottom-[-10%] [animation-delay:-5s] !bg-(--secondary)" />
            </div>
        </div>
    );
};