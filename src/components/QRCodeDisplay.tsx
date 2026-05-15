import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, ExternalLink } from 'lucide-react';

export default function QRCodeDisplay() {
  const currentUrl = window.location.origin;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl border border-emerald-100 max-w-sm mx-auto">
      <div className="bg-emerald-100 p-4 rounded-2xl mb-6">
        <QrCode size={48} className="text-emerald-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800 mb-2">Escaneie para Jogar</h3>
      <p className="text-slate-500 text-center mb-8 text-sm">
        Aponte a câmera do seu celular para entrar na Jornada Cognitiva.
      </p>

      <div className="bg-white p-4 rounded-2xl shadow-inner border-4 border-emerald-500 mb-8">
        <QRCodeSVG 
          value={currentUrl} 
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
        <ExternalLink size={16} />
        <span>{currentUrl}</span>
      </div>
    </div>
  );
}
