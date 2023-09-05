import { useEffect, useRef } from "react";

export default function UseClickOutside(
  elRef: React.RefObject<HTMLElement>, //ref to the element you want to detect clicks outside of (e.g. a dropdown), but also the element you want to ignore clicks of (e.g. a button that opens the dropdown)
  callback: () => void
) {
  const callbackRef = useRef() as React.MutableRefObject<
    (e: MouseEvent) => void
  >;
  callbackRef.current = callback;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!elRef?.current?.contains(e.target as Node) && callbackRef.current) {
        callbackRef.current(e);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [callbackRef, elRef]);
}
