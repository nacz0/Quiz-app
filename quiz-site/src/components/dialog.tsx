import { useRef, type PropsWithChildren } from "react";
import UseClickOutside from "~/lib/hooks/useClickOutside";

export function Dialog(
  props: {
    openFn: (b: boolean) => void;
    dialogClass: string;
  } & PropsWithChildren
) {
  const { openFn, children, dialogClass } = props;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  UseClickOutside(dialogRef, () => openFn(false));

  return (
    <div className="fixed top-0 z-40 h-screen w-screen backdrop-blur-sm   sm:px-4 sm:pt-20 ">
      <div
        ref={dialogRef}
        className={` h-full w-full  px-4 py-2  shadow-2xl sm:h-3/5 sm:rounded-lg ${dialogClass}`}
      >
        {children}
      </div>
    </div>
  );
}
