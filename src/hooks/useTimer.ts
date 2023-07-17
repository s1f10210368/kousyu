import { useEffect, useState } from 'react';

export const useTimer = (userInput: (0 | 2 | 1 | 3)[][], bombMap: number[][]) => {
  const [timer, setTimer] = useState(0);

  //ゲーム開始
  const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  //爆発
  const isFailure = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1)
  );

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
  return {
    timer,
  };
};
