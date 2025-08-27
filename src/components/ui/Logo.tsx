import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'light' | 'dark';
    showIcon?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
    size = 'md', 
    variant = 'dark',
    showIcon = true 
}) => {
    const sizes = {
        sm: { text: 'text-xl', icon: 24, container: 'h-8' },
        md: { text: 'text-2xl', icon: 32, container: 'h-10' },
        lg: { text: 'text-4xl', icon: 48, container: 'h-16' }
    };

    const colors = {
        light: {
            text: 'text-white',
            accent: 'text-white',
            icon: '#ffffff'
        },
        dark: {
            text: 'text-gray-900',
            accent: 'text-gray-900',
            icon: '#1a1a1a'
        }
    };

    const currentSize = sizes[size];
    const currentColors = colors[variant];

    return (
        <div className={`flex items-center gap-3 ${currentSize.container}`}>
            {showIcon && (
                <div className="relative">
                    <svg 
                        width={currentSize.icon} 
                        height={currentSize.icon} 
                        viewBox="0 0 80 80" 
                        className="relative z-10"
                    >
                        {/* Outer circle - subtle */}
                        <circle 
                            cx="40" 
                            cy="40" 
                            r="35" 
                            fill="none" 
                            stroke="#e5e5e5" 
                            strokeWidth="1.5"
                        />
                        
                        {/* Inner gradient circle */}
                        <circle 
                            cx="40" 
                            cy="40" 
                            r="30" 
                            fill="none" 
                            stroke="url(#logoGradient)" 
                            strokeWidth="2" 
                            opacity="0.4"
                        />
                        
                        {/* N7 monogram */}
                        <path 
                            d="M 25 55 L 25 25 L 43 50 L 43 20 M 48 25 L 48 38 L 54 38 L 48 55" 
                            fill="none" 
                            stroke={currentColors.icon}
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                        
                        {/* Accent dot */}
                        <circle 
                            cx="54" 
                            cy="20" 
                            r="3.5" 
                            fill="#ff6b6b"
                        />
                        
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor:"#ff6b6b", stopOpacity:1}} />
                                <stop offset="100%" style={{stopColor:"#764ba2", stopOpacity:1}} />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            )}
            
            <div className="flex items-baseline">
                <span 
                    className={`font-semibold ${currentSize.text} ${currentColors.text} tracking-wide`}
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                    NEVELLINE
                </span>
                <span 
                    className={`font-bold ${currentSize.text === 'text-xl' ? 'text-2xl' : currentSize.text === 'text-2xl' ? 'text-3xl' : 'text-5xl'} ml-0.5`}
                    style={{ 
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        background: 'linear-gradient(135deg, #ff6b6b, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    S
                </span>
            </div>
        </div>
    );
};

// Compact version for favicons and small spaces
export const LogoIcon: React.FC<{ size?: number }> = ({ size = 32 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 80 80">
            <rect width="80" height="80" rx="16" fill="#1a1a1a"/>
            <path 
                d="M 20 60 L 20 20 L 35 45 L 35 18 M 42 20 L 42 35 L 50 35 L 42 60" 
                fill="none" 
                stroke="#ffffff"
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <circle cx="50" cy="18" r="4" fill="#ff6b6b"/>
        </svg>
    );
};