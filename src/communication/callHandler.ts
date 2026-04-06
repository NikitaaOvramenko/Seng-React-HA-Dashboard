import type { HassEntityWithService } from "@hakit/core";

export const handleInboundCall = (
  setCalled: React.Dispatch<React.SetStateAction<boolean>>, notification: HassEntityWithService<"automation">
) => {
  setCalled(true);
  notification.service.trigger();
};

export const handleInboundHangup = (setStatus: React.Dispatch<React.SetStateAction<string>>) =>{
  setStatus("Hangup")
}