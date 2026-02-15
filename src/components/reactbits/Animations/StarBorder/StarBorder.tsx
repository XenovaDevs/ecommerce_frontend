import React from 'react';

type StarBorderOwnProps = {
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
};

type StarBorderProps<T extends React.ElementType> = {
  as?: T;
} & StarBorderOwnProps & Omit<React.ComponentPropsWithoutRef<T>, keyof StarBorderOwnProps | 'as'>;

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as ?? 'button';
  const componentProps = rest as React.ComponentPropsWithoutRef<T>;
  const mergedStyle: React.CSSProperties = {
    padding: `${thickness}px 0`,
    ...(componentProps.style as React.CSSProperties | undefined),
  };

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[20px] ${className}`}
      {...componentProps}
      style={mergedStyle}
    >
      <div
        className="absolute bottom-[-11px] right-[-250%] z-0 h-[50%] w-[300%] rounded-full opacity-70 animate-star-movement-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute left-[-250%] top-[-10px] z-0 h-[50%] w-[300%] rounded-full opacity-70 animate-star-movement-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-1 rounded-[20px] border border-gray-800 bg-gradient-to-b from-black to-gray-900 px-[26px] py-[16px] text-center text-[16px] text-white">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
