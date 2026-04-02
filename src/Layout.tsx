import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="grid gap-4 p-4 pb-28 grid-cols-1 md:grid-cols-2 items-start w-full">
      {children}
    </div>
  );
}
