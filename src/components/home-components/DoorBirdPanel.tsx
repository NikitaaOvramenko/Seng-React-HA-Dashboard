import { Cctv, Phone, Mic, PhoneOff, Zap, Smartphone } from "lucide-react";
import PageHeader from "../miscellaneous/PageHeader";
import * as sip from "../../communication/sipClient";
import ReactPlayer from 'react-player'
import { useCall } from "@/context/useCallContext";
import { useEntity } from "@hakit/core";


export default function DoorBirdPanel() {
  const irEntity = useEntity('button.doorbird_ir')
  const lockEntity = useEntity('button.doorbird_relay_1')
  const callCxt = useCall()


  const irOn = async() => {
      irEntity.service.press();
  }

  const lockOn = async() => {
      lockEntity.service.press();
  }

  return (
    <div className="flex flex-col gap-5 px-4 pb-28">
      
      
      <PageHeader icon={Cctv} title="DoorBird" />

      {/* Camera feed */}
      <div className="relative overflow-hidden aspect-video w-full max-w-2xl mx-auto" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem", boxShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
        <ReactPlayer
           style={{width:"100%", height:"100%"}}
           src={callCxt.cameraCur.stream.url} autoPlay playsInline          
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-3">
          <span className="text-white text-xs font-semibold tracking-wide uppercase">
            Doorbird live
          </span>
          <span className="text-zinc-400 text-xs font-medium bg-zinc-900/80 px-2 py-0.5 rounded-full">
            {callCxt.statusCur}
          </span>
        </div>
      </div>

      {/* IR + Switch quick toggles */}
      <div className="flex gap-3 max-w-2xl mx-auto w-full">
        <button
          onClick={() => irOn()}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-white text-sm font-semibold cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
        >
          <Zap size={14} strokeWidth={2} className="text-zinc-400" />
          IR
        </button>
        <button
        onClick={() => lockOn()}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-white text-sm font-semibold cursor-pointer hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
        >
          <Smartphone size={14} strokeWidth={1.8} className="text-zinc-400" />
          Switch
        </button>
      </div>

      {/* Contacts */}
      <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest px-1">
          Contacts
        </span>
        <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <Smartphone size={15} className="text-zinc-400" strokeWidth={1.8} />
            </div>
            <span className="text-white text-sm font-semibold">Doorbell</span>
          </div>

          <button
            onClick={async () => {
              try {
                callCxt.statusSetter("Calling...");
                await sip.callSip(import.meta.env.VITE_DOORBELL_AOR);
                callCxt.statusSetter("Answered")
              } catch (err) {
                console.error("Call failed:", err);
                callCxt.statusSetter("Call failed");
              }
            }}
            disabled={!callCxt.sipReadyCur}
            type="button"
            className="text-white text-xs font-bold tracking-widest uppercase bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 px-3 py-1.5 rounded-full cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Call
          </button>
        </div>
      </div>

      {/* Call status card */}
      <div className="flex flex-col max-w-2xl mx-auto w-full rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center justify-center py-10">
          <span className="text-zinc-500 text-sm font-medium">{callCxt.statusCur}</span>
        </div>
        <div className="flex items-center justify-around px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
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
            type="button"
            className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors"
          >
            <Mic size={18} className="text-white" strokeWidth={1.8} />
          </button>

          {/* <span className="text-zinc-500 text-sm font-mono font-bold">{callTime}</span> */}

          <button
            onClick={async () => {
              try {
                await sip.hangupSip();
                callCxt.statusSetter("Hung up");
              } catch (err) {
                console.error("Hangup failed:", err);
                callCxt.statusSetter("Hangup failed");
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