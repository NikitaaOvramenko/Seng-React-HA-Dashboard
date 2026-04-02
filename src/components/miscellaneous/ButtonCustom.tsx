import { useEntity, type EntityName } from "@hakit/core";
import Bulb from "../../assets/lightbulb.svg?react";
import type { ReactNode } from "react";

interface Props {
  entityName: EntityName;
  className?: string;
  children: ReactNode;
}

export default function ButtonCustom({
  className = "",
  entityName,
  children,
}: Props) {
  const entity = useEntity(entityName);

  const state = entity?.state ?? "unavailable";
  const isOn = state === "on";
  const isUnavailable = state === "unavailable" || state === "unknown";

  const handleClick = () => {
    if (isUnavailable) return;
    if (isOn) {
      (entity?.service as any)?.turnOff?.();
    } else {
      (entity?.service as any)?.turnOn?.();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isUnavailable}
      aria-pressed={isOn}
      className={`
        ${className}
        w-full h-13 px-4 py-3
        flex items-center justify-between
        rounded-2xl border
        transition-all duration-150
        select-none
        ${isOn
          ? "bg-white border-white"
          : "bg-zinc-900 border-zinc-800"
        }
        ${isUnavailable
          ? "opacity-40 cursor-not-allowed"
          : "hover:border-zinc-600 active:scale-[0.98] cursor-pointer"
        }
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Bulb
          className={`
            w-5 h-5 shrink-0 transition-colors duration-150
            ${isOn ? "text-yellow-200" : "text-zinc-500"}
          `}
        />
        <span className={`truncate text-sm font-semibold ${isOn ? "text-black" : "text-white"}`}>
          {children}
        </span>
      </div>

      <span
        className={`
          text-xs font-bold px-2.5 py-1 rounded-full
          ${isUnavailable
            ? "bg-zinc-800 text-zinc-500"
            : isOn
            ? "bg-black/10 text-black"
            : "bg-zinc-800 text-zinc-500"
          }
        `}
      >
        {isUnavailable ? "N/A" : isOn ? "On" : "Off"}
      </span>
    </button>
  );
}
