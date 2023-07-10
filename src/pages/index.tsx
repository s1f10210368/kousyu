import { useEffect, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  //0 -> 未クリック
  //1 -> 左クリック
  //2 -> はてな
  //3 -> 旗

  const [userInput, setUserInput] = useState<(0 | 1 | 2 | 3)[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const bomCount = 10;

  // 0 -> ボムなし
  // 1 -> ボム有
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const board = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];

  //ゲーム開始
  const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  //爆発
  const isFailure = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  );

  //時刻表示
  //タイマーの経過時間を保持する変数。初期値０
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    if (isFailure) {
      clearInterval(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, isFailure]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds}`;
  };

  //boardを計算でusestateとbombmapから作る
  // -1 -> 石
  // 0 -> 画像なしセル
  // 1~8 -> 数字セル
  // 9 -> 石＋はてな
  // 10 -> 石＋旗
  // 11 -> ボムセル
  //const board: number[][] = [];

  //クリック数
  const clickCount = userInput.flat().filter((value) => value === 1).length;
  const flagCount = userInput.flat().filter((value) => value === 3).length;

  //8方向辞書
  const directions = [
    //左から反時計回り
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];

  //押した場所周囲８方向を探索し隣接を再帰する
  const check = (x: number, y: number) => {
    let bombCount = 0;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < bombMap[0].length && ny >= 0 && ny < bombMap.length) {
        if (bombMap[nx][ny] === 1) {
          bombCount++;
        }
      }
    }
    board[x][y] = bombCount;
    //bomがない場合に空白連鎖処理
    if (bombCount === 0) {
      for (const [cx, cy] of directions) {
        const mx = x + cx;
        const my = y + cy;

        if (mx >= 0 && mx < bombMap[0].length && my >= 0 && my < bombMap.length) {
          //my,mxが未訪問の時実行
          if (board[mx][my] === -1) {
            //console.log('check');
            //console.log(my, mx);
            check(mx, my);
          }
        }
      }
    }
  };

  //GameOverのフラッグ
  let gameOver = false;
  let gameWin = false;
  //boardの作成
  const createBoard = () => {
    for (let x = 0; x < userInput.length; x++) {
      for (let y = 0; y < userInput[x].length; y++) {
        if (userInput[x][y] === 1) {
          //ボムあるときゲームオーバー
          if (bombMap[x][y] === 1) {
            board[x][y] = 11;
            gameOver = true;

            //bombを一斉に表示
            board.forEach((row, x) =>
              row.forEach((cell, y) => {
                if (bombMap[x][y] === 1) {
                  board[x][y] = 11;
                }
              })
            );
            console.log('ゲームオーバー');
          }
          // 押したところにボムないとき
          if (bombMap[x][y] === 0) {
            check(x, y);
          }
        }
        //フラグ処理
        else if (userInput[x][y] === 3) {
          board[x][y] = 10;
        }
        //ゲーム勝利
        if (!board.some((row) => row.includes(-1))) {
          gameWin = true;
        }
      }
    }
    return board;
  };
  createBoard();

  //userInputが１の場合のみtrue（ボム作成時に使用）
  const jaj = userInput.flat().filter((input) => input === 1).length === 0;

  const onClick = (x: number, y: number) => {
    console.log(x, y);

    //爆発したらまたはゲーム勝利したらおせなくする
    for (let x = 0; x < userInput.length; x++) {
      for (let y = 0; y < userInput[x].length; y++) {
        if (board[x][y] === 11 || !board.some((row) => row.includes(-1))) {
          return;
        }
      }
    }

    //ユーザのクリックに応じてuserInputの値を更新
    const updatedUserInput = [...userInput];
    updatedUserInput[x][y] = 1;
    setUserInput(updatedUserInput);
    console.log('ターン変わった！');
    console.log('userInput↓');
    console.table(userInput);

    //ボムの配置
    if (jaj) {
      const updatedBombMap = [...bombMap];
      let count = 0;
      while (count < bomCount) {
        const randomX = Math.floor(Math.random() * 9);
        const randomY = Math.floor(Math.random() * 9);
        if (randomX !== x && randomY !== y && updatedBombMap[randomX][randomY] !== 1) {
          updatedBombMap[randomX][randomY] = 1;
          count++;
        }
        setBombMap(updatedBombMap);
      }
    }

    console.log('BombMap↓');
    console.table(bombMap);

    //boardを作成
    createBoard();
    console.log('board↓');
    console.table(board);
  };

  const onRightClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    x: number,
    y: number
  ) => {
    event.preventDefault();

    //爆発したらおせなくする
    for (let x = 0; x < userInput.length; x++) {
      for (let y = 0; y < userInput[x].length; y++) {
        if (board[x][y] === 11 || !board.some((row) => row.includes(-1))) {
          return;
        }
      }
    }

    // ユーザの右クリックに応じて userInput の値を更新
    const updatedUserInput = [...userInput];
    if (updatedUserInput[x][y] === 0) {
      updatedUserInput[x][y] = 3; // 旗
    } else if (updatedUserInput[x][y] === 3) {
      updatedUserInput[x][y] = 0; // 未クリックに戻す
    }
    setUserInput(updatedUserInput);
  };

  //bomb表示（いらない）
  // board.forEach((row, x) =>
  //   row.forEach((cell, y) => {
  //     if (bombMap[x][y] === 1) {
  //       board[x][y] = 11;
  //     }
  //   })
  // );

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {/* フラッグ表示 */}
        <div className={styles.left}>{10 - flagCount}</div>
        {/* ニコちゃんマーク表示 */}
        <div className={styles.between} />

        {/* タイマー表示 */}
        <div className={styles.timelog}>
          <div>{formatTime(timer)}</div>
        </div>
      </div>
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
  );
};

export default Home;
