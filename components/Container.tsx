import React from "react";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export default function Container({ className = "", children, ...props }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
      {children}
    </div>
  );
}


