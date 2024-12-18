const ProgressBar = ({ objetosRestantes, objetosTotal }) => {
  const progresso = ((objetosTotal - objetosRestantes) / objetosTotal) * 100;

  return (
    <div className="w-full bg-white/30 rounded-full h-6 mb-4 relative overflow-hidden backdrop-blur-sm">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out relative"
        style={{ width: `${progresso}%` }}
      >
        <div
          className="absolute inset-0 animate-shine"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white drop-shadow-lg">
          {objetosRestantes} {objetosRestantes === 1 ? 'objeto' : 'objetos'} restantes
        </span>
      </div>
    </div>
  );
};

export default ProgressBar; 