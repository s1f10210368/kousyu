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

  const board: number[][] = [];
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
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];

  //押した場所周囲８方向を探索し隣接している数字を表示する関数
  const check = (x: number, y: number, direction: number[]) => {
    //bombMapから
    const [dx, dy] = direction;
    const tempX = x + dx;
    const tempY = y + dy;
    let bom_count = 0;

    if (bombMap[tempX][tempY] === 1) {
      bom_count = 1;
      return bom_count;
    }
    return bom_count;
    console.log(bom_count);
  };

  //userInputが１の場合のみtrue（ボム作成時に使用）
  const jaj = userInput.flat().filter((input) => input === 1).length === 1;

  const onClick = (x: number, y: number) => {
    console.log(x, y);

    //ユーザのクリックに応じてuserInputの値を更新
    const updatedUserInput = [...userInput];
    updatedUserInput[y][x] = 1;
    setUserInput(updatedUserInput);

    //ボムの配置
    if (jaj) {
      const updatedBombMap = [...bombMap];
      let count = 0;
      while (count < bomCount) {
        const randomX = Math.floor(Math.random() * 9);
        const randomY = Math.floor(Math.random() * 9);
        if (randomX !== x && randomY !== y && updatedBombMap[randomY][randomY] !== 1) {
          updatedBombMap[randomY][randomX] = 11;
          count++;
        }
        setBombMap(updatedBombMap);
      }
    }
    console.log('BombMap');
    console.table(bombMap);

    //board作成
    for (let y = 0; y < updatedUserInput.length; y++) {
      const row: number[] = [];
      for (let x = 0; x < updatedUserInput[y].length; x++) {
        if (updatedUserInput[y][x] === 1) {
          if (bombMap[y][x] === 1) {
            row.push(11); //ボムセル
          } else {
            const count = 0;

            row.push(count); //数字セル
          }
        } else {
          row.push(-1); //石
        }
      }
      board.push(row);
    }
    console.log('Board');
    console.table(board);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {userInput.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => onClick(x, y)}>
              {color !== 0 && (
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
