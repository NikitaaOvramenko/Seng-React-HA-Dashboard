import { useEffect, useState } from "react";

interface Props{
    timeSet:number
}

export function Timer({timeSet}:Props) {

const [,setTime] = useState<number>(timeSet);

useEffect(() => {
    
   const interval =  setInterval(() =>  {
    
    
        setTime((prev) => {
        console.log(prev)

        if(prev <= 0){
            return prev
        }
        return prev - 1})
   
    
    },1000)

    return () => clearInterval(interval)
    
},[])
return(<></>)

}