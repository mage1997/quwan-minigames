import GameCard from '../components/GameCard';
import { formatMs, getHighScore } from '../utils/storage';

const games = [
  {
    id: '2048',
    to: '/2048',
    title: '2048',
    subtitle: '滑动合并，挑战数字极限',
    icon: '🎯',
    accent: '#f59e0b',
    getScore: () => String(getHighScore('2048')),
  },
  {
    id: 'snake',
    to: '/snake',
    title: '贪吃蛇',
    subtitle: '经典街机，越吃越长',
    icon: '🐍',
    accent: '#10b981',
    getScore: () => String(getHighScore('snake')),
  },
  {
    id: 'memory',
    to: '/memory',
    title: '记忆翻牌',
    subtitle: '配对相同图案，考验记忆力',
    icon: '🧠',
    accent: '#8b5cf6',
    getScore: () => {
      const best = getHighScore('memory');
      return best > 0 ? `${best} 步` : '—'; // lower is better
    },
  },
  {
    id: 'reaction',
    to: '/reaction',
    title: '反应力',
    subtitle: '绿光出现，极速点击',
    icon: '⚡',
    accent: '#ef4444',
    getScore: () => {
      const best = getHighScore('reaction');
      return best > 0 ? formatMs(best) : '—';
    },
  },
];

export default function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <span className="home-badge">精品合集</span>
        <h1>趣玩</h1>
        <p>四款精心打磨的小游戏，随时随地来一局</p>
      </header>

      <section className="game-grid">
        {games.map((game) => (
          <GameCard
            key={game.id}
            to={game.to}
            title={game.title}
            subtitle={game.subtitle}
            icon={game.icon}
            accent={game.accent}
            highScore={game.getScore()}
          />
        ))}
      </section>

      <footer className="home-footer">
        <p>支持键盘 · 触屏 · 手势操作</p>
      </footer>
    </div>
  );
}
