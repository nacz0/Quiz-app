import { useEffect, useState } from "react";

export function Timer(props: { seconds: number }) {
  const [seconds, setSeconds] = useState(props.seconds);
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds === 0) {
        clearInterval(interval);
        return;
      }
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);
  return <div>{seconds}</div>;
}
