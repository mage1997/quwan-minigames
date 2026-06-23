import { Link } from 'react-router-dom';

interface GameCardProps {
  to: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  highScore?: string;
}

export default function GameCard({ to, title, subtitle, icon, accent, highScore }: GameCardProps) {
  return (
    <Link to={to} className="game-card" style={{ '--accent': accent } as React.CSSProperties}>
      <div className="game-card-icon">{icon}</div>
      <div className="game-card-body">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        {highScore && <span className="game-card-score">最佳 · {highScore}</span>}
      </div>
      <span className="game-card-arrow">→</span>
    </Link>
  );
}
