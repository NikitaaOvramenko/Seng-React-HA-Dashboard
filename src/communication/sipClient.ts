import { Web } from "sip.js";

let simpleUser: Web.SimpleUser | null = null;


export async function initSip(audioEl: HTMLAudioElement) {
  if (simpleUser) return simpleUser;

  const server = "wss://homeassistant.taildbc544.ts.net:8089/ws";
  const aor = "sip:100@asterisk";

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
      authorizationUsername: "100",
      authorizationPassword: "As123456789900",
    },
  };

  simpleUser = new Web.SimpleUser(server, options);

  simpleUser.delegate = {
    onCallReceived: async () => {
      console.log("Incoming call received");
    },
  };

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