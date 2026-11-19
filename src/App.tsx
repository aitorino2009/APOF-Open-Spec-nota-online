import { Award, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

export default function App() {
  const triggerConfetti = () => {
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="rounded-xl bg-white p-8 shadow-lg text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Award className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-indigo-600">Nota Online</h1>
        <p className="mt-2 text-slate-600">
          Sistema de votación de notas para presentaciones en clase.
        </p>
        <div className="flex justify-center my-4">
          <QRCodeSVG value="https://example.com" size={120} />
        </div>
        <button
          onClick={triggerConfetti}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <QrCode className="w-4 h-4" /> Probar dependencias
        </button>
      </div>
    </div>
  );
}
