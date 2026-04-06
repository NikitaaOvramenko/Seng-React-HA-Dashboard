import { useEntity, type EntityName } from "@hakit/core";
import Bulb from "../../assets/lightbulb.svg?react";
import type { ReactNode } from "react";

interface Props {
  entityName: EntityName;
  children: ReactNode;
  className:string
}

export default function ButtonCustom({ entityName, children,className }: Props) {
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
      className={` ${className} w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-150 select-none active:scale-[0.98]`}
      style={{
        background: isOn ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.06)",
        border: isOn ? "1px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        opacity: isUnavailable ? 0.4 : 1,
        cursor: isUnavailable ? "not-allowed" : "pointer",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Bulb
          className="w-5 h-5 shrink-0 transition-colors duration-150"
          style={{ color: isOn ? "#fef08a" : "rgba(255,255,255,0.3)" }}
        />
        <span
          className="truncate text-sm font-semibold"
          style={{ color: isOn ? "#000" : "#fff" }}
        >
          {children}
        </span>
      </div>

      <span
        className="text-xs font-bold px-2.5 py-1 rounded-full"
        style={{
          background: isOn ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)",
          color: isOn ? "#000" : "rgba(255,255,255,0.4)",
        }}
      >
        {isUnavailable ? "N/A" : isOn ? "On" : "Off"}
      </span>
    </button>
  );
}
