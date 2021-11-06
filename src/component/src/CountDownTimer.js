import React, { useState, useEffect } from "react";
export default function useTimer(startTime) {
  const [time, setTime] = useState(startTime);
  const [intervalID, setIntervalID] = useState(null);
  const hasTimerEnded = time <= 0;
  const isTimerRunning = intervalID != null;

  const update = () => {
    setTime((time) => time - 1);
  };

  const startTimer = () => {
    setTime(startTime);
    if (!isTimerRunning) {
      setIntervalID(setInterval(update, 1000));
    }
  };

  const stopTimer = () => {
    clearInterval(intervalID);
    setIntervalID(null);
  };

  useEffect(() => {
    if (hasTimerEnded) {
      clearInterval(intervalID);
      setIntervalID(null);
      // setTime(startTime)
    }
  }, [hasTimerEnded]);

  useEffect(
    () => () => {
      clearInterval(intervalID);
    },
    []
  );
  return {
    time,
    startTimer,
    stopTimer,
  };
}
