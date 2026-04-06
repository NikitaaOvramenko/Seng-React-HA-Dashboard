import { HassConnect } from '@hakit/core'
import { Routes, Route, HashRouter } from 'react-router-dom';
import MainFloor from './pages/MainFloor';
import Outside from './pages/Outside';
import DoorBird from './pages/DoorBird';
import Navbar from './components/miscellaneous/Navbar';
import Screensaver from './components/miscellaneous/Screensaver';
import { TimeProvider } from './context/useTimeContext';
import CallContextProvider from './context/useCallContext';
import CallModal from "./components/miscellaneous/CallModal"
import SpotlightBackground from './components/ui/spotlight-background';


function App() {
  const url = import.meta.env.VITE_HA_URL;

  return (
    <HassConnect hassUrl={url}>
      <CallContextProvider>
      <TimeProvider>

      <HashRouter>
        <SpotlightBackground>
          <Routes>
            <Route path="/" element={<MainFloor/>} />
            <Route path="/outside" element={<Outside />} />
            <Route path="/doorbird" element={<DoorBird />} />
          </Routes>
        </SpotlightBackground>
        <Screensaver />
        <CallModal />
        <Navbar />
      </HashRouter>

      </TimeProvider>
      </CallContextProvider>
    </HassConnect>
  );
}

export default App
