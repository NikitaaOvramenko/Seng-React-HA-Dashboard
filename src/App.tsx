
import { HassConnect } from '@hakit/core'
import Home from './pages/Home'
import { Routes, Route, HashRouter } from 'react-router-dom';
import MainFloor from './pages/MainFloor';
import Outside from './pages/Outside';
import Navbar from './components/miscellaneous/Navbar';
import { ThemeProvider } from '@hakit/components';
function App() {

  const url = import.meta.env.VITE_HA_URL;

  return (
    <HassConnect hassUrl={url}>
      {/* <ThemeProvider></ThemeProvider> */}
        
        
        <HashRouter >
        <Navbar></Navbar>
          <Routes>
            <Route path="/" element={<Home></Home>}></Route>
            <Route path="/main-floor" element={<MainFloor></MainFloor>}></Route>
            <Route path="/outside" element={<Outside></Outside>}></Route>
          </Routes>
          
        </HashRouter>

        
      
    </HassConnect>

  )
}

export default App
