import { useCallback, useEffect, useRef, useState } from 'react';
import GameLayout from '../components/GameLayout';
import { getHighScore, setHighScore } from '../utils/storage';

const GRID = 15;
type Dir = 'up' | 'down' | 'left' | 'right';
type Point = { x: number; y: number };

function randomFood(snake: Point[]): Point {
  let pos: Point;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

function initState() {
  const snake: Point[] = [
    { x: 7, y: 7 },
    { x: 6, y: 7 },
    { x: 5, y: 7 },
  ];
  return { snake, food: randomFood(snake), dir: 'right' as Dir, score: 0 };
}

export default function Snake() {
  const [snake, setSnake] = useState<Point[]>(() => initState().snake);
  const [food, setFood] = useState<Point>(() => initState().food);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getHighScore('snake'));
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const dirRef = useRef<Dir>('right');
  const nextDirRef = useRef<Dir>('right');
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const scoreRef = useRef(score);
  const gameOverRef = useRef(gameOver);
  const pausedRef = useRef(paused);

  snakeRef.current = snake;
  foodRef.current = food;
  scoreRef.current = score;
  gameOverRef.current = gameOver;
  pausedRef.current = paused;

  const reset = useCallback(() => {
    const s = initState();
    setSnake(s.snake);
    setFood(s.food);
    setScore(0);
    setGameOver(false);
    setPaused(false);
    dirRef.current = 'right';
    nextDirRef.current = 'right';
  }, []);

  const setDirection = useCallback((dir: Dir) => {
    const opposite: Record<Dir, Dir> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };
    if (dir !== opposite[dirRef.current]) {
      nextDirRef.current = dir;
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      if (gameOverRef.current || pausedRef.current) return;

      const dir = nextDirRef.current;
      dirRef.current = dir;

      const head = snakeRef.current[0];
      const delta: Record<Dir, Point> = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };
      const newHead = {
        x: head.x + delta[dir].x,
        y: head.y + delta[dir].y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID ||
        newHead.y < 0 ||
        newHead.y >= GRID ||
        snakeRef.current.some((s) => s.x === newHead.x && s.y === newHead.y)
      ) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snakeRef.current];
      let newScore = scoreRef.current;

      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        newScore += 10;
        setScore(newScore);
        if (setHighScore('snake', newScore)) setBest(newScore);
        const f = randomFood(newSnake);
        setFood(f);
        foodRef.current = f;
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const id = setInterval(tick, 120);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        setDirection(dir);
      }
      if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setDirection]);

  const snakeSet = new Set(snake.map((s) => `${s.x},${s.y}`));
  const headKey = `${snake[0].x},${snake[0].y}`;

  return (
    <GameLayout
      title="贪吃蛇"
      subtitle="吃到食物得分，别撞墙"
      score={`${score}`}
      extra={
        <>
          <button className="btn btn-primary" onClick={reset}>
            新游戏
          </button>
          <button className="btn btn-ghost" onClick={() => setPaused((p) => !p)}>
            {paused ? '继续' : '暂停'}
          </button>
          <span className="score-badge" style={{ marginLeft: 'auto' }}>
            最高 {best}
          </span>
        </>
      }
    >
      <div className="snake-board">
        {Array.from({ length: GRID * GRID }, (_, i) => {
          const x = i % GRID;
          const y = Math.floor(i / GRID);
          const key = `${x},${y}`;
          let cls = 'snake-cell';
          if (key === headKey) cls += ' head';
          else if (snakeSet.has(key) && key !== headKey) cls += ' body';
          else if (food.x === x && food.y === y) cls += ' food';
          return <div key={key} className={cls} />;
        })}
      </div>

      <div className="dpad">
        <div className="dpad-btn empty" />
        <button className="dpad-btn" onClick={() => setDirection('up')}>
          ↑
        </button>
        <div className="dpad-btn empty" />
        <button className="dpad-btn" onClick={() => setDirection('left')}>
          ←
        </button>
        <div className="dpad-btn empty" />
        <button className="dpad-btn" onClick={() => setDirection('right')}>
          →
        </button>
        <div className="dpad-btn empty" />
        <button className="dpad-btn" onClick={() => setDirection('down')}>
          ↓
        </button>
        <div className="dpad-btn empty" />
      </div>

      {paused && !gameOver && <div className="overlay-msg">已暂停 · 按空格或点继续</div>}
      {gameOver && (
        <div className="overlay-msg">
          游戏结束 · 得分 {score}
          <br />
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={reset}>
            再来一局
          </button>
        </div>
      )}
    </GameLayout>
  );
}
