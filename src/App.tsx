import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TrueOrFalsePiaget from './components/TrueOrFalsePiaget';
import Leaderboard from './components/Leaderboard';
import QRCodeDisplay from './components/QRCodeDisplay';
import { Trophy, Gamepad2, QrCode } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-emerald-50">
        <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 p-1.5 rounded-lg">
                  <Gamepad2 className="text-white" size={24} />
                </div>
                <span className="font-black text-emerald-900 tracking-tight text-xl hidden sm:block">
                  PIAGET QUEST
                </span>
              </div>
              
              <div className="flex gap-4 sm:gap-8">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold transition-colors"
                >
                  <Gamepad2 size={20} />
                  <span className="hidden xs:block">Jogar</span>
                </Link>
                <Link 
                  to="/placar" 
                  className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold transition-colors"
                >
                  <Trophy size={20} />
                  <span className="hidden xs:block">Placar</span>
                </Link>
                <Link 
                  to="/qrcode" 
                  className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold transition-colors"
                >
                  <QrCode size={20} />
                  <span className="hidden xs:block">QR Code</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-10 px-4">
          <Routes>
            <Route path="/" element={<TrueOrFalsePiaget />} />
            <Route path="/placar" element={<Leaderboard />} />
            <Route path="/qrcode" element={<QRCodeDisplay />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
