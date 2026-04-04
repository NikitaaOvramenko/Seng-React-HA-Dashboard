declare module 'react-open-weather' {
  import React from 'react';

  export interface UseOpenWeatherOptions {
    key: string;
    lat: string;
    lon: string;
    lang: string;
    unit: 'metric' | 'standard' | 'imperial';
  }

  export interface WeatherData {
    // Define specific types if known; otherwise, use any
    [key: string]: any;
  }

  export function useOpenWeather(options: UseOpenWeatherOptions): {
    data: WeatherData | null;
    isLoading: boolean;
    errorMessage: string | null;
  };

  export interface ReactWeatherProps {
    data?: WeatherData;
    isLoading?: boolean;
    errorMessage?: string | null;
    // Add other props if known
  }

  export const ReactWeather: React.ComponentType<ReactWeatherProps>;
}