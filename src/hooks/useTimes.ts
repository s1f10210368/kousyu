const useTimes = () => {
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedMinutes = minutes.toString().padStart(1, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${formattedMinutes}${formattedSeconds}`;
  };
  return {
    formatTime,
  };
};
export { useTimes };
