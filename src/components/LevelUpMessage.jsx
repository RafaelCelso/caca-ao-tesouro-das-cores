import { useEffect } from 'react';

const LevelUpMessage = ({ nivel, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Fecha após 3 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl transform animate-bounce-short text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Parabéns!
        </h2>
        <p className="text-xl text-gray-700 mb-4">
          Você alcançou o nível {nivel}!
        </p>
        <div className="text-4xl">
          {'🌟'.repeat(Math.min(nivel, 5))}
        </div>
      </div>
    </div>
  );
};

export default LevelUpMessage; 