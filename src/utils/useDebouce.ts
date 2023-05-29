import { useState } from "react";

type SomeFunction = (...args: any[]) => void;
type Timer = ReturnType<typeof setTimeout>;

export function useDebounce<Func extends SomeFunction>(
  func: Func,
  delay: number | undefined
) {
  const [timer, setTimer] = useState<Timer>(); //Create timer state

  const debouncedFunction = ((...args) => {
    const newTimer = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      func(...args);
    }, delay);
    clearTimeout(timer); //Cancel previous timers
    setTimer(newTimer); //Save latest timer
  }) as Func;

  return debouncedFunction;
}


