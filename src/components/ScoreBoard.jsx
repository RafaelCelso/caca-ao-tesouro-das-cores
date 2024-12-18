const ScoreBoard = ({ pontuacao, nivel, corAlvo, melhorPontuacao, niveisConsecutivosSemErro }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-2 mt-6">
      <div className="grid grid-cols-5 gap-4 items-center">
        {/* Cor Alvo - Agora maior e mais destacada */}
        <div className="flex flex-col items-center justify-center col-span-1">
          <div 
            className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg transform hover:scale-105 transition-transform animate-pulse"
            style={{ 
              backgroundColor: corAlvo?.hex,
              border: '6px solid white',
              boxShadow: `0 0 20px ${corAlvo?.hex}40, 0 0 40px ${corAlvo?.hex}20`
            }}
          />
          <div className="mt-2 text-sm font-bold text-gray-700">
            Encontre esta cor!
          </div>
        </div>

        {/* Card de Nível */}
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-2 rounded-xl text-center shadow-md">
          <div className="text-2xl">🌟</div>
          <div className="text-xl font-bold text-yellow-700">{nivel}</div>
          <div className="text-xs font-medium text-yellow-800">Nível</div>
        </div>

        {/* Card de Pontuação Atual */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-xl text-center shadow-md">
          <div className="text-2xl">🎯</div>
          <div className="text-xl font-bold text-blue-700">{pontuacao}</div>
          <div className="text-xs font-medium text-blue-800">Pontos</div>
        </div>

        {/* Card de Melhor Pontuação */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-2 rounded-xl text-center shadow-md">
          <div className="text-2xl">👑</div>
          <div className="text-xl font-bold text-purple-700">{melhorPontuacao}</div>
          <div className="text-xs font-medium text-purple-800">Recorde</div>
        </div>

        {/* Card de Níveis sem Errar */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-2 rounded-xl text-center shadow-md">
          <div className="text-2xl">🏆</div>
          <div className="text-xl font-bold text-green-700">{niveisConsecutivosSemErro}</div>
          <div className="text-xs font-medium text-green-800">Sequência</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard; 