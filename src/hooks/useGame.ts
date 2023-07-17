import { useIndex } from './useIndex';

const useGame = () => {
  const { userInput, bombMap, setUserInput, setBombMap, directions, board } = useIndex();

  //空白連鎖処理
  const chainBlank = (bombCount: number, x: number, y: number) => {
    const validCoordinates = directions
      .map(([cx, cy]) => [x + cx, y + cy])
      .filter(([mx, my]) => isWithinBounds(mx, my) && board[mx][my] === -1);

    for (const [mx, my] of validCoordinates) {
      check(mx, my);
    }
  };

  const isWithinBounds = (x: number, y: number) => {
    return x >= 0 && x < bombMap[0].length && y >= 0 && y < bombMap.length;
  };

  //押した場所周囲８方向を探索し隣接を再帰する
  const check = (x: number, y: number) => {
    let bombCount = 0;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (isWithinBounds(ny, nx) && bombMap[nx][ny] === 1) {
        bombCount++;
      }
    }
    board[x][y] = bombCount;
    //bomがない場合に空白連鎖処理
    if (bombCount === 0) {
      chainBlank(bombCount, x, y);
    }
  };

  //GameOverのフラッグ
  let gameOver = false;
  //GameWinのフラッグ
  let gameWin = false;

  //bomあるとき
  const bombProcess = (x: number, y: number) => {
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
      }
      // 押したところにボムないとき
      if (bombMap[x][y] === 0) {
        check(x, y);
      }
    }
  };

  //boardの作成
  const createBoard = () => {
    for (let x = 0; x < userInput.length; x++) {
      for (let y = 0; y < userInput[x].length; y++) {
        bombProcess(x, y);
        //フラグ処理
        if (userInput[x][y] === 3) {
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

  //bomの配置
  const arrangementBomb = (x: number, y: number) => {
    if (jaj) {
      const updatedBombMap = [...bombMap];
      let count = 0;
      while (count < 10) {
        const randomX = Math.floor(Math.random() * 9);
        const randomY = Math.floor(Math.random() * 9);
        if (randomX !== x && randomY !== y && updatedBombMap[randomX][randomY] !== 1) {
          updatedBombMap[randomX][randomY] = 1;
          count++;
        }
        setBombMap(updatedBombMap);
      }
    }
  };

  //爆発したらまたはゲーム勝利したらおせなくする
  const endBoard = () => {
    for (let x = 0; x < userInput.length; x++) {
      for (let y = 0; y < userInput[x].length; y++) {
        if (board[x][y] === 11 || !board.some((row) => row.includes(-1))) {
          return;
        }
      }
    }
  };

  const onClick = (x: number, y: number) => {
    console.log(x, y);

    //爆発したらまたはゲーム勝利したらおせなくする
    endBoard();

    //ユーザのクリックに応じてuserInputの値を更新
    const updatedUserInput = [...userInput];
    updatedUserInput[x][y] = 1;
    setUserInput(updatedUserInput);
    console.log('ターン変わった！');
    console.log('userInput↓');
    console.table(userInput);

    //ボムの配置
    arrangementBomb(x, y);

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
    endBoard();

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
