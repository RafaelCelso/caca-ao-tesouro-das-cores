const MAX_VIDAS = 3;

const Vida = ({ ativa }) => (
  <div
    className={`relative transition-all duration-300 transform
      ${ativa 
        ? 'scale-100 rotate-0' 
        : 'scale-90 rotate-12 opacity-40 grayscale'}`}
  >
    <div className="text-3xl relative">
      {/* Coração base */}
      <span className="block">❤️</span>
      
      {/* Efeito de brilho quando ativo */}
      {ativa && (
        <div className="absolute inset-0 animate-pulse">
          <span className="block text-red-500 opacity-50">❤️</span>
        </div>
      )}
    </div>
    
    {/* Efeito de sombra */}
    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-black/10 rounded-full blur-sm" />
  </div>
);

const Vidas = ({ vidas }) => {
  return (
    <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-purple-700 mr-2">Vidas:</span>
        <div className="flex gap-1">
          {Array.from({ length: MAX_VIDAS }).map((_, index) => (
            <Vida key={index} ativa={index < vidas} />
          ))}
        </div>
      </div>
    </div>
  );
};

export { MAX_VIDAS };
export default Vidas; 