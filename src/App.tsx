import { HassConnect } from '@hakit/core'
import { Routes, Route, HashRouter } from 'react-router-dom';
import MainFloor from './pages/MainFloor';
import Outside from './pages/Outside';
import DoorBird from './pages/DoorBird';
import Navbar from './components/miscellaneous/Navbar';
import Screensaver from './components/miscellaneous/Screensaver';
import { TimeProvider } from './context/useTimeContext';

function App() {
  const url = import.meta.env.VITE_HA_URL;

  return (
    <HassConnect hassUrl={url}>
      <TimeProvider>
      
      <HashRouter>
        <div  className='absolute inset-0 pointer-events-none h-full w-full'></div>
        <Screensaver></Screensaver>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainFloor/>} />
          <Route path="/outside" element={<Outside />} />
          <Route path="/doorbird" element={<DoorBird />} />
        </Routes>
      </HashRouter>

      </TimeProvider>
    </HassConnect>
  );
}

export default App
