import { HassConnect } from '@hakit/core'
import { Routes, Route, HashRouter } from 'react-router-dom';
import MainFloor from './pages/MainFloor';
import Outside from './pages/Outside';
import DoorBird from './pages/DoorBird';
import Navbar from './components/miscellaneous/Navbar';
import {Timer} from './components/miscellaneous/Timer';

function App() {
  const url = import.meta.env.VITE_HA_URL;

  return (
    <HassConnect hassUrl={url}>
      <HashRouter>
        <Navbar />
        <Timer timeSet={10}/>
        <Routes>
          
          <Route path="/" element={<MainFloor />} />
          <Route path="/outside" element={<Outside />} />
          <Route path="/doorbird" element={<DoorBird />} />
        </Routes>
      </HashRouter>
    </HassConnect>
  );
}

export default App
