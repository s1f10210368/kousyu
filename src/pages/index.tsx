import { useGame } from '../hooks/useGame';
import { useIndex } from '../hooks/useIndex';
import styles from './index.module.css';

const Home = () => {
  const { board, timer, gameWin, gameOver, onClick, onRightClick, clickCount, flagCount } =
    useGame();

  const { formatFlagCount, formatTime } = useIndex();

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.top}>
          {/* onClik={() => resetGame()} */}
          {/* フラッグ表示 */}
          <div className={styles.left}>{formatFlagCount(10 - flagCount)}</div>
          {/* ニコちゃんマーク表示 */}
          {!gameOver && !gameWin && <div className={styles.betweensmile} />}
          {gameOver && <div className={styles.betweensad} />}
          {gameWin && <div className={styles.betweenwin} />}
          {/* タイマー表示 */}
          <div className={styles.timelog}>
            <div>{formatTime(timer)}</div>
          </div>
        </div>
        {/* マインスイーパーを表示 */}
        <div className={styles.board}>
          {board.map((row, x) =>
            row.map((cell, y) => (
              <div
                className={styles.cell}
                key={`${x}-${y}`}
                onClick={() => onClick(x, y)}
                onContextMenu={(e) => onRightClick(e, x, y)}
              >
                {cell === -1 && <div className={styles.stone} />}
                {cell === 0 && <div className={styles.stone0} style={{}} />}
                {cell > 0 && cell < 9 && (
                  <div className={styles.number} style={{ backgroundPosition: -30 * cell + 30 }} />
                )}

                {cell === 10 && <div className={styles.flag} />}
                {cell === 11 && <div className={styles.bom} />}
              </div>
            ))
          )}
        </div>
      </div>
      {/* ログを表示 */}
      <div className={styles.rilog}>
        {/* ゲームオーバーを表示する */}
        {gameOver && (
          <div className={styles.gameover}>
            <div>
              <p>
                ゲームオーバー
                <br />
                時間:
                {formatTime(timer)}
                <br />
                クリック数：{clickCount} + {flagCount}
              </p>
            </div>
          </div>
        )}
        {/* ゲーム勝利を表示する */}
        {gameWin && (
          <div className={styles.gamewin}>
            <div>
              <p>
                おめでとう！
                <br />
                時間:{formatTime(timer)} <br />
                クリック数:{clickCount} + {flagCount}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
