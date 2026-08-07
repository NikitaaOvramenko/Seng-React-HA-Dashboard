import { useEntity, type EntityName, type HassEntityWithService } from "@hakit/core";
import Bulb from "../../assets/lightbulb.svg?react";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";

const HOLD_DELAY_MS = 400;
const UPDATE_INTERVAL_MS = 100;

interface Props {
  entityName: EntityName;
  children: ReactNode;
  className:string
}

export default function ButtonCustom({ entityName, children,className }: Props) {
  const entity = useEntity(entityName) as HassEntityWithService<"light">;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slidingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const pointerXRef = useRef(0);
  const lastUpdateRef = useRef(0);
  const [isSliding, setIsSliding] = useState(false);
  const [previewBrightness, setPreviewBrightness] = useState<number | null>(null);

  const state = entity?.state ?? "unavailable";
  const isOn = state === "on";
  const isUnavailable = state === "unavailable" || state === "unknown";
  const colorModes = entity?.attributes.supported_color_modes;
  const supportsBrightness =
    typeof entity?.attributes.brightness === "number" ||
    (Array.isArray(colorModes) && colorModes.some((mode) => mode !== "onoff"));
  const currentBrightness = isOn
    ? Math.round(((entity?.attributes.brightness as number | undefined) ?? 255) / 2.55)
    : 0;
  const displayedBrightness = previewBrightness ?? currentBrightness;
  const showBrightnessFill = supportsBrightness && (isOn || isSliding);

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const brightnessFromPointer = (clientX: number) => {
    const bounds = buttonRef.current?.getBoundingClientRect();
    if (!bounds) return currentBrightness;
    return Math.round(Math.min(1, Math.max(0, (clientX - bounds.left) / bounds.width)) * 100);
  };

  const applyBrightness = (brightness: number, force = false) => {
    setPreviewBrightness(brightness);

    const now = Date.now();
    if (!force && now - lastUpdateRef.current < UPDATE_INTERVAL_MS) return;
    lastUpdateRef.current = now;

    if (brightness === 0) {
      entity.service.turnOff();
    } else {
      entity.service.turnOn({ serviceData: { brightness_pct: brightness } });
    }
  };

  const finishSliding = (event: PointerEvent<HTMLButtonElement>) => {
    clearHoldTimer();
    if (!slidingRef.current) return;

    applyBrightness(brightnessFromPointer(event.clientX), true);
    slidingRef.current = false;
    suppressClickRef.current = true;
    setIsSliding(false);
    setPreviewBrightness(null);
  };

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (isUnavailable) return;
    if (isOn) {
      entity.service.turnOff();
    } else {
      entity.service.turnOn();
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (isUnavailable || !supportsBrightness || event.button !== 0) return;

    pointerXRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
    clearHoldTimer();
    holdTimerRef.current = setTimeout(() => {
      slidingRef.current = true;
      suppressClickRef.current = true;
      setIsSliding(true);
      applyBrightness(brightnessFromPointer(pointerXRef.current), true);
    }, HOLD_DELAY_MS);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    pointerXRef.current = event.clientX;
    if (!slidingRef.current) return;
    event.preventDefault();
    applyBrightness(brightnessFromPointer(event.clientX));
  };

  const handlePointerCancel = () => {
    clearHoldTimer();
    if (slidingRef.current) suppressClickRef.current = true;
    slidingRef.current = false;
    setIsSliding(false);
    setPreviewBrightness(null);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishSliding}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(event) => supportsBrightness && event.preventDefault()}
      disabled={isUnavailable}
      aria-pressed={isOn}
      title={supportsBrightness ? "Tap to toggle, press and hold to dim" : "Tap to toggle"}
      className={` ${className} relative w-full flex items-center justify-between overflow-hidden px-4 py-3 rounded-2xl transition-all duration-150 select-none active:scale-[0.98]`}
      style={{
        background: showBrightnessFill
          ? `linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.92) ${displayedBrightness}%, rgba(255,255,255,0.06) ${displayedBrightness}%, rgba(255,255,255,0.06) 100%)`
          : isOn
            ? "rgba(255,255,255,0.92)"
            : "rgba(255,255,255,0.06)",
        border: isOn || isSliding ? "1px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        opacity: isUnavailable ? 0.4 : 1,
        cursor: isUnavailable ? "not-allowed" : "pointer",
        touchAction: "pan-y",
      }}
    >
      <div
        className="flex items-center gap-3 min-w-0"
        style={{ mixBlendMode: showBrightnessFill ? "difference" : "normal" }}
      >
        <Bulb
          className="w-5 h-5 shrink-0 transition-colors duration-150"
          style={{ color: showBrightnessFill ? "#fff" : isOn ? "#fef08a" : "rgba(255,255,255,0.3)" }}
        />
        <span
          className="truncate text-sm font-semibold"
          style={{ color: showBrightnessFill ? "#fff" : isOn ? "#000" : "#fff" }}
        >
          {children}
        </span>
      </div>

      <span
        className="text-xs font-bold px-2.5 py-1 rounded-full"
        style={{
          background: showBrightnessFill ? "transparent" : isOn ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)",
          color: showBrightnessFill ? "#fff" : isOn ? "#000" : "rgba(255,255,255,0.4)",
          mixBlendMode: showBrightnessFill ? "difference" : "normal",
        }}
      >
        {isUnavailable
          ? "N/A"
          : isSliding || (isOn && supportsBrightness)
            ? `${displayedBrightness}%`
            : isOn
              ? "On"
              : "Off"}
      </span>

    </button>
  );
}
