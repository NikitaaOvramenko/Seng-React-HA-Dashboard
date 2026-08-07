import { useCamera, useEntity, type CameraEntityExtended } from "@hakit/core";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import * as sip from "../communication/sipClient";
import { setupSipClient } from "../communication/sipClient";
import { ringtone } from "../lib/ringtones"
import { useSnackbar } from "./useSnackbar";
import { devToolsEnabled } from "../config/devTools";

const RINGTONE_GAIN = 2.0;

interface CallContextProps {
 audioRefCur:RefObject<HTMLAudioElement | null>
 sipReadyCur:boolean
 statusCur:string
 calledCur:boolean
 testCallCur:boolean
 cameraCur:CameraEntityExtended

 sipReadySetter: (set:boolean) => void
 statusSetter: (status:string) => void
 calledSetter: (called:boolean) => void
 startTestCall: () => void
 
}

interface CallProviderProps{
  children:ReactNode
}

const CallContext = createContext<CallContextProps | null>(null)

export default function CallContextProvider({children}:CallProviderProps) {

  const notification = useEntity('automation.doorbell')
    const { showSnackbar } = useSnackbar();
    const notificationRef = useRef(notification);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);
    const ringtoneCtxRef = useRef<AudioContext | null>(null);
    const ringtoneSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const ringtoneGainRef = useRef<GainNode | null>(null);
    const [sipReady, setSipReady] = useState(false);
    const [status, setStatus] = useState("Initializing...");
    const [called,setCalled] = useState(false)
    const [testCall, setTestCall] = useState(false)
    const camera = useCamera('camera.doorbird_live')
    const previousCalledRef = useRef(false);
   


    const sipReadySetter = (set:boolean) => {
        setSipReady(set)
    }
     const statusSetter = (status:string) => {
      setStatus(status)
    }
     const calledSetter = (called:boolean) => {
      setCalled(called)
      if (!called) setTestCall(false)
    }
    const startTestCall = () => {
      if (!devToolsEnabled) return;
      setTestCall(true)
      setStatus("Ringing")
      setCalled(true)
    }
     

  // Set up Web Audio GainNode on the ringtone element once (allows gain > 1.0)
  useEffect(() => {
    const el = ringtoneRef.current;
    if (!el) return;
    if (ringtoneCtxRef.current) return;

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(el);
    const gain = ctx.createGain();
    gain.gain.value = RINGTONE_GAIN;
    source.connect(gain);
    gain.connect(ctx.destination);
    ringtoneCtxRef.current = ctx;
    ringtoneSourceRef.current = source;
    ringtoneGainRef.current = gain;

    return () => {
      ctx.suspend().catch(() => {});
    };
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
    if (called && !previousCalledRef.current) {
      showSnackbar("Incoming DoorBird call", "info");
    }
    previousCalledRef.current = called;
  }, [called, showSnackbar]);

  useEffect(() => {
    if (status === "Answered") {
      showSnackbar("Call answered", "success");
    } else if (status === "Hangup" || status === "Hung up") {
      showSnackbar("Call ended", "info");
    } else if (/failed|error|missing/i.test(status)) {
      showSnackbar(status, "error", 5000);
    }
  }, [showSnackbar, status]);

  useEffect(() => {
    notificationRef.current = notification;
  }, [notification]);

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
          setupSipClient(setCalled,setStatus,notificationRef.current);
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
      testCallCur: testCall,
      cameraCur: camera,
      sipReadySetter,
      statusSetter,
      calledSetter,
      startTestCall,
    }}>
      <audio ref={audioRef} autoPlay style={{ display: 'none' }} />
      <audio ref={ringtoneRef} src={ringtone.giornos_ringtone} loop style={{ display: 'none' }} />
      {children}
    </CallContext.Provider>
  );
}

// Context providers and their hooks intentionally share this module.
// eslint-disable-next-line react-refresh/only-export-components
export function useCall(){
  const context = useContext(CallContext)
  
     if(!context) {
          throw new Error('useCall must be used within CallContextProvider');
      }
  
      return context;
}
