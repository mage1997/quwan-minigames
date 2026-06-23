import { useCallback, useEffect, useState } from 'react';
import GameLayout from '../components/GameLayout';
import { getHighScore, setBestLowScore, shuffle } from '../utils/storage';

const ICONS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🌸', '⭐', '🎵'];

interface Card {
  id: number;
  icon: string;
  flipped: boolean;
  matched: boolean;
}

function createDeck(): Card[] {
  const pairs = shuffle([...ICONS, ...ICONS]);
  return pairs.map((icon, id) => ({
    id,
    icon,
    flipped: false,
    matched: false,
  }));
}

export default function Memory() {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(() => getHighScore('memory'));
  const [lock, setLock] = useState(false);
  const [won, setWon] = useState(false);

  const matchedCount = cards.filter((c) => c.matched).length;

  const reset = useCallback(() => {
    setCards(createDeck());
    setFlippedIds([]);
    setMoves(0);
    setLock(false);
    setWon(false);
  }, []);

  const flip = (id: number) => {
    if (lock) return;
    const card = cards[id];
    if (card.flipped || card.matched) return;
    if (flippedIds.length >= 2) return;

    const nextFlipped = [...flippedIds, id];
    setCards((prev) =>
      prev.map((c, i) => (i === id ? { ...c, flipped: true } : c)),
    );
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = nextFlipped;
      if (cards[a].icon === cards[b].icon) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === a || i === b ? { ...c, matched: true } : c,
            ),
          );
          setFlippedIds([]);
          setLock(false);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === a || i === b ? { ...c, flipped: false } : c,
            ),
          );
          setFlippedIds([]);
          setLock(false);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (matchedCount === cards.length && cards.length > 0 && moves > 0) {
      setWon(true);
      const currentBest = getHighScore('memory');
      if (currentBest === 0 || moves < currentBest) {
        setBestLowScore('memory', moves);
        setBest(moves);
      }
    }
  }, [matchedCount, cards.length, moves]);

  const bestMoves = best;

  return (
    <GameLayout
      title="记忆翻牌"
      subtitle="找出所有相同图案"
      score={`${moves} 步`}
      extra={
        <button className="btn btn-primary" onClick={reset}>
          新游戏
        </button>
      }
    >
      <div className="memory-stats">
        <div className="stat-item">
          <span>步数</span>
          <strong>{moves}</strong>
        </div>
        <div className="stat-item">
          <span>已配对</span>
          <strong>
            {matchedCount / 2}/{cards.length / 2}
          </strong>
        </div>
        <div className="stat-item">
          <span>最少步数</span>
          <strong>{bestMoves > 0 ? bestMoves : '—'}</strong>
        </div>
      </div>

      <div className="memory-board">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className={`memory-card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
            onClick={() => flip(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && flip(i)}
          >
            <div className="memory-card-inner">
              <div className="memory-face front">?</div>
              <div className="memory-face back">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {won && (
        <div className="overlay-msg success">
          🎉 全部配对成功！共 {moves} 步
          <br />
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={reset}>
            再来一局
          </button>
        </div>
      )}
    </GameLayout>
  );
}
