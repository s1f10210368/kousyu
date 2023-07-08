import { useState } from 'react';
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
  //const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  //爆発
  //const isFailure = userInputs.some((row, y) =>
  //  row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  //);

  //boardを計算でusestateとbombmapから作る
  // -1 -> 石
  // 0 -> 画像なしセル
  // 1~8 -> 数字セル
  // 9 -> 石＋はてな
  // 10 -> 石＋旗
  // 11 -> ボムセル
  //const board: number[][] = [];

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

  // console.log('board1');
  // console.table(board);

  // for (let s = 0; s < 9; s++) {
  //   for (let t = 0; t < 9; t++) {
  //     if (board[s][t] === -1) {
  //       board[s][t] = 0;
  //     }
  //   }
  // }
  // console.log('board2');
  // console.table(board);

  //押した場所周囲８方向を探索し隣接している数字を返す関数
  const check = (x: number, y: number) => {
    let bombCount = 0;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < bombMap[0].length && ny >= 0 && ny < bombMap.length) {
        if (bombMap[ny][nx] === 1) {
          bombCount++;
        }
      }
    }
    return bombCount;
  };

  //boardの作成
  const createBoard = () => {
    for (let y = 0; y < userInput.length; y++) {
      for (let x = 0; x < userInput[y].length; x++) {
        if (userInput[y][x] === 1) {
          //ボムあるときゲームオーバー
          if (bombMap[y][x] === 1) {
            board[y][x] = 11;
            console.log('ゲームオーバー');
          }
          // ボムないとき
          else {
            //隣接するボムを計測
            const count = check(x, y);
            //隣接するボムが０の時
            if (count === 0) {
              //空白連鎖処理
              board[y][x] = 0;
              for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < bombMap[0].length && ny >= 0 && ny < bombMap.length) {
                  while (check(nx, ny) !== 0) {
                    userInput[dy][dx] = 1;
                    board[dy][dx] = 0;
                  }
                }
              }
            }

            //隣接するボムがあるとき
            else {
              board[y][x] = count;
            }
          }
        } else {
          board[y][x] = -1;
        }
      }
    }
    return board;
  };

  //隣接するボムが０の時ユーザーインプットを１に更新
  // const expandBlank = (x: number, y: number) => {
  //   if (userInput[y][x] === 0) {
  //     userInput[y][x] = 1;

  //     for (const [dx, dy] of directions) {
  //       const nx = x + dx;
  //       const ny = y + dy;
  //       if (nx >= 0 && nx < bombMap[0].length && ny >= 0 && ny < bombMap.length) {
  //         if (userInput[ny][nx] === 0) {
  //           userInput[ny][nx] = 1;
  //           const count = check(nx, ny);
  //           if (count === 0) {
  //             expandBlank(nx, ny);
  //           } else {
  //             userInput[ny][nx] = 1;
  //           }
  //         }
  //       }
  //     }
  //   }
  // };

  createBoard();

  //userInputが１の場合のみtrue（ボム作成時に使用）
  const jaj = userInput.flat().filter((input) => input === 1).length === 1;

  const onClick = (x: number, y: number) => {
    console.log(x, y);

    //ユーザのクリックに応じてuserInputの値を更新
    const updatedUserInput = [...userInput];
    updatedUserInput[y][x] = 1;
    setUserInput(updatedUserInput);
    console.table(userInput);

    //ボムの配置
    if (jaj) {
      const updatedBombMap = [...bombMap];
      let count = 0;
      while (count < bomCount) {
        const randomX = Math.floor(Math.random() * 9);
        const randomY = Math.floor(Math.random() * 9);
        if (randomX !== x && randomY !== y && updatedBombMap[randomY][randomY] !== 1) {
          updatedBombMap[randomY][randomX] = 1;
          count++;
        }
        setBombMap(updatedBombMap);
      }
    }
    console.log('BombMap↓');
    console.table(bombMap);

    //boardを作成
    const board = createBoard();
    console.log('Board↓');
    console.table(board);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => onClick(x, y)}>
              {color !== -1 && (
                <div
                  className={styles.stone}
                  //style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
