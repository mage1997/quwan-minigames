import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game2048 from './games/Game2048';
import Snake from './games/Snake';
import Memory from './games/Memory';
import Reaction from './games/Reaction';

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/2048" element={<Game2048 />} />
        <Route path="/snake" element={<Snake />} />
        <Route path="/memory" element={<Memory />} />
        <Route path="/reaction" element={<Reaction />} />
      </Routes>
    </div>
  );
}
