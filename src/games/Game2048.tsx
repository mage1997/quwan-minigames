import { useCallback, useEffect, useRef, useState } from 'react';
import GameLayout from '../components/GameLayout';
import { getHighScore, setHighScore } from '../utils/storage';

type Grid = number[][];

const SIZE = 4;

function createEmptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

function getEmptyCells(grid: Grid): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) cells.push([r, c]);
    }
  }
  return cells;
}

function addRandomTile(grid: Grid): Grid {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = cloneGrid(grid);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function initGrid(): Grid {
  return addRandomTile(addRandomTile(createEmptyGrid()));
}

function slideRowLeft(row: number[]): { row: number[]; gained: number; moved: boolean } {
  const filtered = row.filter((v) => v !== 0);
  const merged: number[] = [];
  let gained = 0;
  let moved = filtered.length !== row.filter((v, i) => v !== 0 || row.slice(i + 1).some((x) => x !== 0)).length;

  for (let i = 0; i < filtered.length; i++) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      gained += val;
      i++;
      moved = true;
    } else {
      merged.push(filtered[i]);
    }
  }

  while (merged.length < SIZE) merged.push(0);

  if (!moved) {
    moved = merged.some((v, i) => v !== row[i]);
  }

  return { row: merged, gained, moved };
}

function rotateGrid(grid: Grid, times: number): Grid {
  let result = cloneGrid(grid);
  for (let t = 0; t < times; t++) {
    const rotated = createEmptyGrid();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        rotated[c][SIZE - 1 - r] = result[r][c];
      }
    }
    result = rotated;
  }
  return result;
}

function moveLeft(grid: Grid): { grid: Grid; gained: number; moved: boolean } {
  let gained = 0;
  let moved = false;
  const next = cloneGrid(grid);

  for (let r = 0; r < SIZE; r++) {
    const { row, gained: g, moved: m } = slideRowLeft(next[r]);
    next[r] = row;
    gained += g;
    moved = moved || m;
  }

  return { grid: next, gained, moved };
}

function move(grid: Grid, dir: 'left' | 'right' | 'up' | 'down'): { grid: Grid; gained: number; moved: boolean } {
  if (dir === 'left') return moveLeft(grid);
  if (dir === 'right') {
    const rotated = rotateGrid(grid, 2);
    const result = moveLeft(rotated);
    return { ...result, grid: rotateGrid(result.grid, 2) };
  }
  if (dir === 'up') {
    const rotated = rotateGrid(grid, 3);
    const result = moveLeft(rotated);
    return { ...result, grid: rotateGrid(result.grid, 1) };
  }
  const rotated = rotateGrid(grid, 1);
  const result = moveLeft(rotated);
  return { ...result, grid: rotateGrid(result.grid, 3) };
}

function canMove(grid: Grid): boolean {
  if (getEmptyCells(grid).length > 0) return true;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = grid[r][c];
      if (c + 1 < SIZE && grid[r][c + 1] === v) return true;
      if (r + 1 < SIZE && grid[r + 1][c] === v) return true;
    }
  }
  return false;
}

function hasWon(grid: Grid): boolean {
  return grid.some((row) => row.some((v) => v >= 2048));
}

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(initGrid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getHighScore('2048'));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const reset = useCallback(() => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, []);

  const handleMove = useCallback(
    (dir: 'left' | 'right' | 'up' | 'down') => {
      if (gameOver) return;

      setGrid((prev) => {
        const { grid: next, gained, moved } = move(prev, dir);
        if (!moved) return prev;

        const withTile = addRandomTile(next);

        setScore((s) => {
          const newScore = s + gained;
          if (setHighScore('2048', newScore)) setBest(newScore);
          return newScore;
        });

        if (hasWon(withTile)) setWon(true);
        if (!canMove(withTile)) setGameOver(true);

        return withTile;
      });
    },
    [gameOver],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, 'left' | 'right' | 'up' | 'down'> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
        a: 'left',
        d: 'right',
        w: 'up',
        s: 'down',
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleMove]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      handleMove(dx > 0 ? 'right' : 'left');
    } else {
      handleMove(dy > 0 ? 'down' : 'up');
    }
  };

  return (
    <GameLayout
      title="2048"
      subtitle="滑动合并相同数字"
      score={`${score}`}
      extra={
        <>
          <button className="btn btn-primary" onClick={reset}>
            新游戏
          </button>
          <span className="score-badge" style={{ marginLeft: 'auto' }}>
            最高 {best}
          </span>
        </>
      }
    >
      <div
        className="board-2048"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {grid.flatMap((row, r) =>
          row.map((val, c) => (
            <div key={`${r}-${c}`} className="cell-2048" data-value={val || undefined}>
              {val || ''}
            </div>
          )),
        )}
      </div>

      <p className="hint-text">方向键 / WASD / 滑动屏幕操作</p>

      {won && !gameOver && (
        <div className="overlay-msg success">🎉 达成 2048！继续挑战更高分</div>
      )}
      {gameOver && (
        <div className="overlay-msg">
          游戏结束 · 最终得分 {score}
          <br />
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={reset}>
            再来一局
          </button>
        </div>
      )}
    </GameLayout>
  );
}
