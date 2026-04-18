import { useCamera, useEntity, type CameraEntityExtended } from "@hakit/core";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import * as sip from "../communication/sipClient";
import { setupSipClient } from "../communication/sipClient";
import { ringtone } from "../lib/ringtones"

const RINGTONE_GAIN = 2.0;

interface CallContextProps {
 audioRefCur:RefObject<HTMLAudioElement | null>
 sipReadyCur:boolean
 statusCur:string
 calledCur:boolean 
 cameraCur:CameraEntityExtended

 sipReadySetter: (set:boolean) => void
 statusSetter: (status:string) => void
 calledSetter: (called:boolean) => void
 
}

interface CallProviderProps{
  children:ReactNode
}

const CallContext = createContext<CallContextProps | null>(null)

export default function CallContextProvider({children}:CallProviderProps) {

  const notification = useEntity('automation.doorbell')
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);
    const ringtoneCtxRef = useRef<AudioContext | null>(null);
    const [sipReady, setSipReady] = useState(false);
    const [status, setStatus] = useState("Initializing...");
    const [called,setCalled] = useState(false)
    const camera = useCamera('camera.doorbird_live')
   


    const sipReadySetter = (set:boolean) => {
        setSipReady(set)
    }
     const statusSetter = (status:string) => {
      setStatus(status)
    }
     const calledSetter = (called:boolean) => {
      setCalled(called)
    }
     

  // Set up Web Audio GainNode on the ringtone element once (allows gain > 1.0)
  useEffect(() => {
    const el = ringtoneRef.current;
    if (!el) return;

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(el);
    const gain = ctx.createGain();
    gain.gain.value = RINGTONE_GAIN;
    source.connect(gain);
    gain.connect(ctx.destination);
    ringtoneCtxRef.current = ctx;

    return () => { ctx.close(); };
  }, []);

  // Play / stop ringtone based on call state
  useEffect(() => {
    const el = ringtoneRef.current;
    if (!el) return;

    if (called && status !== "Answered") {
      ringtoneCtxRef.current?.resume();
      el.currentTime = 0;
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [called, status]);

  useEffect(() => {
      let mounted = true;

      const setupSip = async () => {
        if (!audioRef.current) {
          if (mounted) setStatus("Audio element missing");
          return;
        }

          audioRef.current.volume = 1.0;
  
        try {
          await sip.initSip(audioRef.current);
          setupSipClient(setCalled,setStatus,notification);
          if (mounted) {
            setSipReady(true);
            setStatus("Connected");
          }
        } catch (err) {
          console.error("SIP init failed:", err);
          if (mounted) {
            setSipReady(false);
            setStatus("Init failed");
          }
        }
      };
  
      setupSip();
  
      return () => {
        mounted = false;
      };
    }, []);


  return (
    <CallContext.Provider value={{
      audioRefCur: audioRef,
      sipReadyCur: sipReady,
      statusCur: status,
      calledCur: called,
      cameraCur: camera,
      sipReadySetter,
      statusSetter,
      calledSetter,
    }}>
      <audio ref={audioRef} autoPlay style={{ display: 'none' }} />
      <audio ref={ringtoneRef} src={ringtone.giornos_ringtone} loop style={{ display: 'none' }} />
      {children}
    </CallContext.Provider>
  );
}

export function useCall(){
  const context = useContext(CallContext)
  
     if(!context) {
          throw new Error('useTheme must be used within ThemeContext');
      }
  
      return context;
}