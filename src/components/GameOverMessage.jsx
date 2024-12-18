import { useEffect } from 'react';
import { SOUND_URLS } from '../config/sounds';

const GameOverMessage = ({ pontuacao, melhorPontuacao, onJogarNovamente }) => {
  useEffect(() => {
    const audio = new Audio(SOUND_URLS.gameOver);
    audio.play().catch(error => console.log('Erro ao tocar som:', error));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-dropIn">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2 text-red-600 animate-bounce">
            Game Over! 😢
          </h2>
          
          <div className="my-6 space-y-3">
            <p className="text-xl text-gray-700">
              Sua pontuação: <span className="font-bold text-purple-600">{pontuacao}</span>
            </p>
            <p className="text-lg text-gray-600">
              Melhor pontuação: <span className="font-bold text-purple-600">{melhorPontuacao}</span>
            </p>
          </div>

          <button
            onClick={onJogarNovamente}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full
                     hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200
                     shadow-lg hover:shadow-xl text-lg"
          >
            🎮 Jogar Novamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverMessage; 