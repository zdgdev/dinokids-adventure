import React from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../../utils/soundManager';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'md',
  animate = true,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...rest
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white',
    success: 'bg-success hover:bg-success-600 text-white',
    warning: 'bg-warning hover:bg-warning-600 text-white',
    danger: 'bg-error hover:bg-error-600 text-white',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  // Animation variants
  const buttonVariants = {
    hover: {
      scale: animate ? 1.05 : 1,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: animate ? 0.95 : 1,
      transition: { duration: 0.1 },
    },
  };
  
  // Handle click with sound
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundManager.play('click');
    if (onClick) onClick(e);
  };
  
  return (
    <motion.button
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${roundedStyles[rounded]}
        font-display font-bold shadow-md 
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${variant}-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={handleClick}
      {...rest}
    >
      <span className="flex items-center justify-center">
        {icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </span>
    </motion.button>
  );
};

export default Button;