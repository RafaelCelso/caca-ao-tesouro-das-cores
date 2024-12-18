import { useEffect } from 'react';

const ConquistaMessage = ({ badge, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Fecha após 3 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl transform animate-bounce-short text-center">
        <div className="text-6xl mb-4">{badge.icone}</div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Nova Conquista!
        </h2>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {badge.nome}
        </h3>
        <p className="text-gray-600 mb-4">
          {badge.descricao}
        </p>
        <div className="text-4xl">
          🏆
        </div>
      </div>
    </div>
  );
};

export default ConquistaMessage; 