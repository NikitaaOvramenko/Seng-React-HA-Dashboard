import { useCall } from "@/context/useCallContext";
import * as sip from "../../communication/sipClient";
import { Clock3, Minimize2, Phone, PhoneCall, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export default function CallModal() {
  const callCxt = useCall();
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const isAnswered = callCxt.statusCur === "Answered";
  const controlsEnabled = callCxt.sipReadyCur || callCxt.testCallCur;

  useEffect(() => {
    if (callCxt.calledCur) {
      setIsMinimized(false);
      setCallSeconds(0);
    }
  }, [callCxt.calledCur]);

  useEffect(() => {
    if (!isAnswered || !callCxt.calledCur) return;
    const timer = window.setInterval(() => setCallSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [callCxt.calledCur, isAnswered]);

  if (!callCxt.calledCur) return null;

  const handleAnswer = async () => {
    if (isAnswered) return;
    try {
      if (!callCxt.testCallCur) await sip.answerSip();
      callCxt.statusSetter("Answered");
      setCallSeconds(0);
    } catch (err) {
      console.error("Answer failed:", err);
      callCxt.statusSetter("Answer failed");
    }
  };

  const handleHangup = async () => {
    try {
      if (!callCxt.testCallCur) await sip.hangupSip();
      callCxt.statusSetter("Hung up");
    } catch (err) {
      console.error("Hangup failed:", err);
      callCxt.statusSetter("Hangup failed");
    } finally {
      callCxt.calledSetter(false);
      navigate("/");
    }
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-28 right-4 z-[9999] flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950/95 px-3 py-2.5 text-left text-white shadow-2xl backdrop-blur-xl transition-all hover:border-white/20 hover:bg-zinc-900"
      >
        <span className="relative grid size-9 place-items-center rounded-full bg-white text-black">
          <PhoneCall className="size-4" />
          {!isAnswered && (
            <span className="absolute inset-0 animate-ping rounded-full border border-white/40" />
          )}
        </span>
        <span className="flex flex-col pr-2">
          <span className="text-xs font-semibold">Doorbell</span>
          <span className="text-[11px] text-zinc-500">
            {isAnswered ? formatDuration(callSeconds) : "Incoming call"} · Tap to open
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md animate-in fade-in duration-200">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Doorbell call"
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/95 text-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-3 duration-300"
      >
        <div className="absolute inset-x-12 -top-24 h-40 rounded-full bg-white/8 blur-3xl" />

        <header className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative grid size-10 place-items-center rounded-full bg-zinc-800 ring-1 ring-white/10">
              <PhoneCall className="size-4 text-zinc-200" />
              {!isAnswered && (
                <span className="absolute -right-0.5 -top-0.5 size-2.5 animate-pulse rounded-full border-2 border-zinc-950 bg-white" />
              )}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold">Doorbell</span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                {isAnswered ? (
                  <><Clock3 className="size-3" /> {formatDuration(callSeconds)}</>
                ) : (
                  <><span className="size-1.5 animate-pulse rounded-full bg-white" /> Incoming call</>
                )}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {callCxt.testCallCur && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Test
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              aria-label="Minimize call"
              className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Minimize2 className="size-4" />
            </button>
          </div>
        </header>

        <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
          <ReactPlayer
            src={callCxt.cameraCur.stream.url}
            autoPlay
            playsInline
            style={{ width: "100%", height: "100%" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          {!isAnswered && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-zinc-200 backdrop-blur-md">
                Someone is at the door
              </span>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-center gap-14 border-t border-white/10 bg-white/[0.025] px-6 py-6">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleHangup}
              disabled={!controlsEnabled}
              type="button"
              className="grid size-14 place-items-center rounded-full border border-red-500 bg-red-600 text-white shadow-lg shadow-red-950/30 transition-all hover:scale-105 hover:border-red-400 hover:bg-red-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <PhoneOff className="size-5" strokeWidth={2} />
            </button>
            <span className="text-[11px] font-medium text-zinc-500">Hang up</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleAnswer}
              disabled={!controlsEnabled || isAnswered}
              type="button"
              className="grid size-14 place-items-center rounded-full border border-green-500 bg-green-600 text-white shadow-lg shadow-green-950/30 transition-all hover:scale-105 hover:border-green-400 hover:bg-green-500 active:scale-95 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none"
            >
              <Phone className="size-5" strokeWidth={2} />
            </button>
            <span className="text-[11px] font-medium text-zinc-500">
              {isAnswered ? "Answered" : "Answer"}
            </span>
          </div>
        </footer>
      </section>
    </div>
  );
}
