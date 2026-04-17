import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  width?: "site" | "content";
  className?: string;
};

export default function Container({
  children,
  width = "site",
  className = "",
}: ContainerProps) {
  const maxWidth = width === "content" ? "max-w-content" : "max-w-site";
  return (
    <div className={`mx-auto w-full px-6 ${maxWidth} ${className}`}>
      {children}
    </div>
  );
}
