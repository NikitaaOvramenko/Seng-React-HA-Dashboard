import { useCall } from "@/context/useCallContext";
import * as sip from "../../communication/sipClient";
import { Phone, PhoneOff } from "lucide-react";

export default function CallModal() {

    const callCxt = useCall()

    // Only show modal when there's an incoming call
    if (!callCxt.calledCur) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,0,0,0.71)]">
      <div className="flex h-[50%] w-[50%] flex-col rounded-2xl bg-red-200">
        <div className="top h-[70%] w-full"></div>
        <div className="bottom flex h-[30%] w-full">
            <button
            onClick={async () => {
              try {
                if(callCxt.statusCur == "Answered"){
                  return
                }
                await sip.answerSip();
                callCxt.statusSetter("Answered");
              } catch (err) {
                console.error("Answer failed:", err);
                callCxt.statusSetter("Answer failed");
              }
            }}
            disabled={!callCxt.sipReadyCur}
            type="button"
            className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Phone size={18} className="text-white" strokeWidth={1.8} />
          </button>

          <button
            onClick={async () => {
              try {
                await sip.hangupSip();
                callCxt.statusSetter("Hung up");
                callCxt.calledSetter(false); // Reset called state to hide modal
              } catch (err) {
                console.error("Hangup failed:", err);
                callCxt.statusSetter("Hangup failed");
                callCxt.calledSetter(false); // Reset called state even on error
              }
            }}
            disabled={!callCxt.sipReadyCur}
            type="button"
            className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PhoneOff size={18} className="text-zinc-400" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}