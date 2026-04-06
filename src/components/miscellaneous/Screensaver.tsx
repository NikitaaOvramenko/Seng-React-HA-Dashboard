import { Meteors } from "../ui/meteors";
import { useTime } from "../../context/useTimeContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number };
  weather: { description: string; icon: string; main: string }[];
}

function useNow() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

export default function Screensaver() {
  const ctx = useTime();
  const now = useNow();
  const navigate = useNavigate();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dismissScreensaver = () => {
    ctx.timeSetter(15);
    navigate("/");
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=44.01&lon=-79.45&appid=${import.meta.env.VITE_OPEN_WEATHER_API}&units=metric`
        );

        if (!response.ok) throw new Error("Weather fetch failed");

        const data = await response.json();
        setWeather(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const id = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => clearInterval(id);
  }, []);

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      onPointerDown={dismissScreensaver}
      onTouchStart={dismissScreensaver}
      onClick={dismissScreensaver}
      className={`transition-opacity duration-500 flex justify-center items-center fixed inset-0 z-[99] ${
        ctx.curTime === 0
          ? "opacity-100 pointer-events-auto"
          : "pointer-events-none opacity-0"
      }`}
    >
      <Meteors className="z-10 pointer-events-none" />

      <div className="relative z-20 flex flex-col items-center gap-6 px-4 pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="flex items-end gap-2 tabular-nums">
            <span
              className="text-white font-thin leading-none select-none"
              style={{ fontSize: "clamp(5rem, 15vw, 11rem)", letterSpacing: "-0.04em" }}
            >
              {hours}:{minutes}
            </span>

            <span
              className="text-white/50 font-thin pb-2 select-none"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
            >
              {seconds}
            </span>
          </div>

          <p className="text-white/60 font-light tracking-widest uppercase text-sm mt-1 select-none">
            {dateStr}
          </p>
        </div>

        <div
          className="rounded-2xl px-8 py-5 flex flex-col items-center gap-3 w-full max-w-sm select-none"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {loading && (
            <p className="text-white/40 text-sm animate-pulse">
              Fetching weather…
            </p>
          )}

          {error && !loading && (
            <p className="text-red-400/70 text-sm">
              Unable to load weather
            </p>
          )}

          {weather && !loading && (
            <>
              <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
                {weather.name}, {weather.sys.country}
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="w-16 h-16 drop-shadow-lg"
                  style={{ filter: "brightness(1.2) saturate(1.3)" }}
                />

                <div>
                  <p
                    className="text-white font-light leading-none"
                    style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
                  >
                    {Math.round(weather.main.temp)}°
                    <span className="text-white/50 text-2xl">C</span>
                  </p>

                  <p className="text-white/60 capitalize text-sm mt-0.5">
                    {weather.weather[0].description}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 text-white/45 text-xs font-medium mt-1">
                <span>Feels {Math.round(weather.main.feels_like)}°C</span>
                <span className="text-white/20">|</span>
                <span>Humidity {weather.main.humidity}%</span>
                <span className="text-white/20">|</span>
                <span>Wind {Math.round(weather.wind.speed)} m/s</span>
              </div>
            </>
          )}
        </div>

        <p className="text-white/20 text-xs tracking-widest uppercase">
          tap to dismiss
        </p>
      </div>
    </div>
  );
}