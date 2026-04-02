import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
}

export default function PageHeader({ icon: Icon, title }: Props) {
  return (
    <div className="relative flex items-center justify-center w-full px-4 pt-6 pb-4">
      <div className="flex items-center gap-2.5">
        <Icon size={18} className="text-zinc-400" strokeWidth={2} />
        <span className="text-white text-xl font-bold tracking-tight">
          {title}
        </span>
      </div>
    </div>
  );
}
