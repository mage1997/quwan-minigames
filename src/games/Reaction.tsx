import { useCallback, useEffect, useRef, useState } from 'react';
import GameLayout from '../components/GameLayout';
import { formatMs, getHighScore, setHighScore } from '../utils/storage';

type Phase = 'idle' | 'waiting' | 'ready' | 'too-early' | 'result';

export default function Reaction() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [best, setBest] = useState(() => getHighScore('reaction'));
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const reset = useCallback(() => {
    clearTimer();
    setPhase('idle');
    setResult(null);
  }, []);

  const startRound = () => {
    clearTimer();
    setPhase('waiting');
    setResult(null);

    const delay = 1500 + Math.random() * 3500;
    timerRef.current = window.setTimeout(() => {
      startTimeRef.current = performance.now();
      setPhase('ready');
      timerRef.current = null;
    }, delay);
  };

  const handleClick = () => {
    if (phase === 'idle' || phase === 'result' || phase === 'too-early') {
      startRound();
      return;
    }

    if (phase === 'waiting') {
      clearTimer();
      setPhase('too-early');
      return;
    }

    if (phase === 'ready') {
      const elapsed = performance.now() - startTimeRef.current;
      setResult(elapsed);
      setHistory((h) => [elapsed, ...h].slice(0, 5));
      if (setHighScore('reaction', Math.round(elapsed))) {
        setBest(Math.round(elapsed));
      }
      setPhase('result');
    }
  };

  useEffect(() => () => clearTimer(), []);

  const zoneClass = `reaction-zone ${phase}`;

  const content = (() => {
    switch (phase) {
      case 'idle':
        return (
          <>
            <h2>点击开始</h2>
            <p>等待屏幕变绿后立即点击</p>
          </>
        );
      case 'waiting':
        return (
          <>
            <h2>等待...</h2>
            <p>看到绿色再点，别抢跑</p>
          </>
        );
      case 'ready':
        return (
          <>
            <h2>点！</h2>
            <p>就是现在</p>
          </>
        );
      case 'too-early':
        return (
          <>
            <h2>太早了！</h2>
            <p>点击重试</p>
          </>
        );
      case 'result':
        return (
          <>
            <h2>{formatMs(result!)}</h2>
            <p>{result! < 250 ? '神反应！' : result! < 400 ? '不错！' : '还可以更快'} · 点击继续</p>
          </>
        );
    }
  })();

  return (
    <GameLayout
      title="反应力"
      subtitle="测试你的反应速度"
      score={best > 0 ? formatMs(best) : '—'}
      extra={
        <button className="btn btn-ghost" onClick={reset}>
          重置
        </button>
      }
    >
      <div className={zoneClass} onClick={handleClick} role="button" tabIndex={0}>
        {content}
      </div>

      {history.length > 0 && (
        <div className="reaction-history">
          <h3>最近记录</h3>
          <div className="reaction-list">
            {history.map((ms, i) => (
              <div key={i} className={`reaction-item ${Math.round(ms) === best ? 'best' : ''}`}>
                <span>第 {history.length - i} 次</span>
                <strong>{formatMs(ms)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="hint-text" style={{ marginTop: 20 }}>
        全球平均反应约 250ms，职业电竞选手约 150ms
      </p>
    </GameLayout>
  );
}
