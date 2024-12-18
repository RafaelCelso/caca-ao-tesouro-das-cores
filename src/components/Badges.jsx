export const BADGES = {
  iniciante: {
    id: 'iniciante',
    nome: 'Iniciante',
    descricao: 'Completou o primeiro nível',
    icone: '🎯'
  },
  mestre: {
    id: 'mestre',
    nome: 'Mestre das Cores',
    descricao: 'Alcançou o nível 10',
    icone: '👑'
  },
  precisao: {
    id: 'precisao',
    nome: 'Precisão',
    descricao: 'Completou 15 níveis consecutivos sem erros',
    icone: '🎯'
  },
  persistente: {
    id: 'persistente',
    nome: 'Persistente',
    descricao: 'Jogou por 5 dias',
    icone: '📅'
  }
};

const Badge = ({ badge, conquistado }) => (
  <div 
    className={`p-3 rounded-lg ${conquistado 
      ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' 
      : 'bg-gray-100'}`}
  >
    <div className="text-3xl mb-1">{badge.icone}</div>
    <h3 className="font-bold text-sm">{badge.nome}</h3>
    <p className="text-xs text-gray-600">{badge.descricao}</p>
  </div>
);

const Badges = ({ conquistados = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-3 text-purple-600">Conquistas 🏆</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.values(BADGES).map(badge => (
          <Badge
            key={badge.id}
            badge={badge}
            conquistado={conquistados.includes(badge.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Badges; 