import { useEffect, useState } from 'react';
import { useIndex } from './useIndex';

const useGame = () => {
  const { userInput, bombMap, setUserInput, setBombMap, board, directions } = useIndex();

  //boardを計算でusestateとbombmapから作る
  // -1 -> 石
  // 0 -> 画像なしセル
  // 1~8 -> 数字セル
  // 9 -> 石＋はてな
  // 10 -> 石＋旗
  // 11 -> ボムセル

  //ゲーム開始
  const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  //爆発
  const isFailure = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  );

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    if (isFailure) {
      clearInterval(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, isFailure]);

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
  //GameWinのフラッグ
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
  const bomCount = 10;

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

  //クリック数
  const clickCount = userInput.flat().filter((value) => value === 1).length;
  //旗の数
  const flagCount = userInput.flat().filter((value) => value === 3).length;

  return {
    userInput,
    bombMap,
    isPlaying,
    isFailure,
    timer,
    setTimer,
    gameOver,
    gameWin,
    board,
    onClick,
    onRightClick,
    clickCount,
    flagCount,
  };
};

export { useGame };
