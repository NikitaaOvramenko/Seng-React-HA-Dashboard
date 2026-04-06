import { useCall } from "@/context/useCallContext";
import * as sip from "../../communication/sipClient";
import { Phone, PhoneOff } from "lucide-react";
import ReactPlayer from 'react-player';
import { useNavigate } from "react-router-dom";

export default function CallModal() {
  const callCxt = useCall();
  const navigate = useNavigate()

  if (!callCxt.calledCur) return null;

  
 

  const isAnswered = callCxt.statusCur === "Answered";

  const handleAnswer = async () => {
    if (isAnswered) return;
    try {
      await sip.answerSip();
      
      callCxt.statusSetter("Answered");
    } catch (err) {
      console.error("Answer failed:", err);
      callCxt.statusSetter("Answer failed");

    }
    
  };

  const handleHangup = async () => {
    try {
      await sip.hangupSip();

      callCxt.statusSetter("Hangup")
    } catch (err) {
      console.error("Hangup failed:", err);
    } finally {
      callCxt.calledSetter(false);
      navigate("/")
    }
  };

  const statusStyle = isAnswered
    ? "bg-green-500/20 text-green-400 border-green-500/30"
    : "bg-amber-500/20 text-amber-400 border-amber-500/30";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="flex flex-col rounded-3xl w-[min(480px,90vw)] overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-white text-sm font-semibold">Doorbell</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyle}`}>
            {callCxt.statusCur}
          </span>
        </div>

        {/* Camera feed */}
        <div className="relative aspect-video w-full" style={{ background: "rgba(255,255,255,0.03)" }}>
          <ReactPlayer
            src={callCxt.cameraCur.stream.url}
            autoPlay
            playsInline
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-16 py-6" style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>

          {/* Answer */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleAnswer}
              disabled={!callCxt.sipReadyCur || isAnswered}
              type="button"
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all
                ${isAnswered
                  ? "bg-green-900/40 border border-green-800/40 opacity-40 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-400 shadow-lg shadow-green-900/50 cursor-pointer"
                }`}
            >
              <Phone size={22} className="text-white" strokeWidth={1.8} />
            </button>
            <span className="text-xs text-zinc-500">{isAnswered ? "Answered" : "Answer"}</span>
          </div>

          {/* Hang up */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleHangup}
              disabled={!callCxt.sipReadyCur}
              type="button"
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 shadow-lg shadow-red-900/50 flex items-center justify-center cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PhoneOff size={22} className="text-white" strokeWidth={1.8} />
            </button>
            <span className="text-xs text-zinc-500">Hang up</span>
          </div>

        </div>
      </div>
    </div>
  );
}
