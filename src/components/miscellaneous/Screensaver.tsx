import { Meteors } from "../ui/meteors";
import { useTime } from "../../context/useTimeContext";

export default function Screensaver() {
const ctx = useTime()

         return (
    <>
    {<div onClick={() => {ctx.timeSetter(10) 

    }}  className={`transition  absolute w-full h-full z-99 duration-300  ${ctx.curTime == 0 ? "  opacity-100":"pointer-events-none opacity-0"}`}>
        <Meteors></Meteors>
    </div>}
    
    
    </>
  );
    

 
}