import { Web } from "sip.js";
import { handleInboundCall } from "./callHandler";


let simpleUser: Web.SimpleUser | null = null;


export async function initSip(audioEl: HTMLAudioElement) {
  if (simpleUser) return simpleUser;

  const server = import.meta.env.VITE_ASTERISK_SERVER!
  const aor = import.meta.env.VITE_AOR!

  const options: Web.SimpleUserOptions = {
    aor,
    media: {
      constraints: {
        audio: true,
        video: false,
      },
      remote: {
        audio: audioEl,
        
      },
    },
    userAgentOptions: {
      authorizationUsername: import.meta.env.VITE_CALLER_NAME!,
      authorizationPassword: import.meta.env.VITE_CALLER_PASS!,
    },
  };
  
  simpleUser = new Web.SimpleUser(server, options);
  

  await simpleUser.connect();
  await simpleUser.register();

  console.log("SIP connected and registered");
  return simpleUser;
}

export async function callSip(destination: string) {
  if (!simpleUser) throw new Error("SIP client not initialized");
  await simpleUser.call(destination);
}

export async function answerSip() {
  if (!simpleUser) throw new Error("SIP client not initialized");
  await simpleUser.answer();
}

export async function hangupSip() {
  if (!simpleUser) throw new Error("SIP client not initialized");
  await simpleUser.hangup();
}

export function getSipClient() {
  return simpleUser;
}

export function setupSipClient(setCalled: React.Dispatch<React.SetStateAction<boolean>>){

  const client = getSipClient();

  if (!client) {
    throw new Error("SIP client not initialized");
  }
    client.delegate = {
    onCallReceived: async () => {
      handleInboundCall(setCalled);
    }
  };
}