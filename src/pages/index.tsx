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
  //const bomCount = 10;

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
  const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
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
    console.log(x, y);

    //ユーザのクリックに応じてuserInputの値を更新
    const updatedUserInput = [...userInput];
    updatedUserInput[y][x] = 1;
    setUserInput(updatedUserInput);

    if (isPlaying) {
      //userInptが0のマスの座標を取得
      const emptyCells = [];
      //userInput.lengthは９
      for (let i = 0; i < userInput.length; i++) {
        for (let j = 0; j < userInput[i].length; j++) {
          if (userInput[i][j] === 0) {
            emptyCells.push([j, i]);
          }
        }
      }
      //ランダムに１０個の座標を取得
      const randomCells = [];
      while (randomCells.length < 10 && emptyCells.length > 0) {
        //０以上１未満のランダムな数値を生成。
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        //emptyCellsからランダムなインデックスに対応する要素を削除し、その要素をrandomCellという変数に代入する
        const randomCell = emptyCells.splice(randomIndex, 1)[0];
        randomCells.push(randomCell);
      }

      //bombMapの該当座標を１に変更
      const updatedBomMap = [...bombMap];
      for (const [x, y] of randomCells) {
        updatedBomMap[y][x] = 1;
      }
      setBombMap(updatedBomMap);
      console.log(updatedBomMap);
    }
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
