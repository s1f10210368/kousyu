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

  //ゲーム開始
  //const isPlaying = userInputs.some((row) => row.some((input) => input !==0));
  //爆発
  //const isFailure = userInputs.some((row, y) =>
  //  row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  //);

  // -1 -> 石
  // 0 -> 画像なしセル
  // 1~8 -> 数字セル
  // 9 -> 石＋はてな
  // 10 -> 石＋旗
  // 11 -> ボムセル
  const board: number[][] = [];

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

  //for (){
  //board + directions + userInput +

  const onClick = (x: number, y: number) => {
    //ボムの配置
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < userInput.length; i++) {
      for (let j = 0; j < userInput[i].length; j++) {
        if (userInput[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    //ランダムにボムを配置
    for (let i = 0; i < bomCount; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [bombX, bombY] = emptyCells[randomIndex];
      bombMap[bombX][bombY] = 1;
      emptyCells.splice(randomIndex, 1);
    }

    //クリックしたマスがボムの位置である場合はゲーム終了
    if (bombMap[x][y] === 1) {
      //爆発アニメーションなどの処理追加
      console.log('爆発！ゲームオーバー');
      return;
    }

    //周辺のマスの調査
    for (const direction of directions) {
      const dx = direction[0];
      const dy = direction[1];
      const newX = x + dx;
      const newY = y + dy;

      //座標がボードの範囲内かを確認
      if (newX >= 0 && newX < userInput.length && newY >= 0 && newY < userInput[newX].length) {
        //周囲のマスにボムがあるかを調べる
        if (bombMap[newX][newY] === 1) {
          //クリックしたマスの値を周囲のボムの数に更新
          userInput[x][y]++;
        }
      }
    }
    //数字が表示されたマスをクリック済みの状態に変更
    userInput[x][y] = 1;
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
                  style={{ background: color === 1 ? '#000' : '#fff' }}
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
