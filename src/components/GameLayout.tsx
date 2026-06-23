import { Link } from 'react-router-dom';

interface GameLayoutProps {
  title: string;
  subtitle?: string;
  score?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

export default function GameLayout({ title, subtitle, score, extra, children }: GameLayoutProps) {
  return (
    <div className="game-page">
      <header className="game-header">
        <Link to="/" className="back-btn" aria-label="返回大厅">
          ←
        </Link>
        <div className="game-header-text">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {score && <div className="score-badge">{score}</div>}
      </header>
      {extra && <div className="game-toolbar">{extra}</div>}
      <main className="game-main">{children}</main>
    </div>
  );
}
