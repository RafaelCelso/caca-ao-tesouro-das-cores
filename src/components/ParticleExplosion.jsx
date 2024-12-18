const ParticleExplosion = ({ x, y, color, onComplete }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 30 * Math.PI) / 180,
    distance: 50,
  }));

  setTimeout(onComplete, 500);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      {particles.map((particle) => {
        const tx = Math.cos(particle.angle) * particle.distance;
        const ty = Math.sin(particle.angle) * particle.distance;

        return (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-particle"
            style={{
              backgroundColor: color,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleExplosion; 