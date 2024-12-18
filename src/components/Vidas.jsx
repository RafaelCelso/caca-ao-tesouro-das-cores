const MAX_VIDAS = 3;

const Vida = ({ ativa, bonus = false }) => (
  <div
    className={`relative transition-all duration-300 transform
      ${ativa 
        ? 'scale-100 rotate-0' 
        : 'scale-90 rotate-12 opacity-40 grayscale'}`}
  >
    <div className="text-3xl relative">
      {/* Coração base */}
      <span className="block">{bonus ? '💖' : '❤️'}</span>
      
      {/* Efeito de brilho quando ativo */}
      {ativa && (
        <div className="absolute inset-0 animate-pulse">
          <span className={`block ${bonus ? 'text-pink-500' : 'text-red-500'} opacity-50`}>
            {bonus ? '💖' : '❤️'}
          </span>
        </div>
      )}
    </div>
    
    {/* Efeito de sombra */}
    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-black/10 rounded-full blur-sm" />
  </div>
);

const Vidas = ({ vidas, vidasBonus = 0 }) => {
  return (
    <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
      <div className="flex items-center gap-4">
        {/* Vidas normais */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-purple-700 mr-2">Vidas:</span>
          <div className="flex gap-1">
            {Array.from({ length: MAX_VIDAS }).map((_, index) => (
              <Vida key={index} ativa={index < vidas} />
            ))}
          </div>
        </div>

        {/* Vidas bônus */}
        {vidasBonus > 0 && (
          <div className="flex items-center gap-2 border-l border-purple-200 pl-4">
            <span className="text-sm font-bold text-pink-600 mr-2">Bônus:</span>
            <div className="flex gap-1">
              {Array.from({ length: vidasBonus }).map((_, index) => (
                <Vida key={`bonus-${index}`} ativa={true} bonus={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { MAX_VIDAS };
export default Vidas; 