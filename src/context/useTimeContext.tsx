import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface TimeContextProps {
  timeSetter: (value: number) => void;
  curTime: number;
}

const TimeContext = createContext<TimeContextProps | null>(null);

type TimeProviderProps = { children: ReactNode };

export function TimeProvider({ children }: TimeProviderProps) {
  const [time, setTime] = useState<number>(15);

  const timeSetter = (value: number) => {
    setTime(value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 0) return prev;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const reset = () => setTime(15);
    document.addEventListener("pointerdown", reset);
    return () => document.removeEventListener("pointerdown", reset);
  }, []);

  return (
    <TimeContext.Provider value={{ timeSetter, curTime: time }}>
      {children}
    </TimeContext.Provider>
  );
}

export function useTime(){
  const context = useContext(TimeContext)

   if(!context) {
        throw new Error('useTheme must be used within ThemeContext');
    }

    return context;
}


