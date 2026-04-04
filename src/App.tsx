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


function App() {
  const url = import.meta.env.VITE_HA_URL;

  return (
    <HassConnect hassUrl={url}>
      <CallContextProvider>
      <TimeProvider>
      
      <HashRouter>
        <div  className='absolute inset-0 pointer-events-none h-full w-full'><Screensaver></Screensaver>
        </div>
        <CallModal></CallModal>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainFloor/>} />
          <Route path="/outside" element={<Outside />} />
          <Route path="/doorbird" element={<DoorBird />} />
        </Routes>
      </HashRouter>

      </TimeProvider>
      </CallContextProvider>
    </HassConnect>
  );
}

export default App
