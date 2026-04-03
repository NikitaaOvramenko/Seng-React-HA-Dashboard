import type { ReactNode } from "react";
import { useTime } from "./context/useTimeContext";


interface Props {
  children?: ReactNode;
}

export default function Layout({ children }: Props) {
  const ctx = useTime()
  return (
    <div onClick={() => ctx.timeSetter(10)} className="grid gap-4 p-4 pb-28 grid-cols-1 md:grid-cols-2 items-start w-full">
      {children}
    </div>
  );
}
