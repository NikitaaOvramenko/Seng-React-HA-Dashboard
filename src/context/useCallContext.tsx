import { useCamera, type CameraEntityExtended } from "@hakit/core";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import * as sip from "../communication/sipClient";
import { setupSipClient } from "../communication/sipClient";

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

    const audioRef = useRef<HTMLAudioElement | null>(null);
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
     

  useEffect(() => {
      let mounted = true;
  
      const setupSip = async () => {
        if (!audioRef.current) {
          if (mounted) setStatus("Audio element missing");
          return;
        }
  
        try {
          await sip.initSip(audioRef.current);
          setupSipClient(setCalled);
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