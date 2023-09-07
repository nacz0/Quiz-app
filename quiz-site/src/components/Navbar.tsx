import Link from "next/link";
import { LogoIcon } from "~/svg/logo";
import PlusIcon from "~/svg/plus";
import { useRef, useState } from "react";
import UseClickOutside from "~/lib/hooks/useClickOutside";
import EditIcon from "~/svg/edit";

export default function Navbar() {
  function CreateQuiz() {
    const [opened, setOpened] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    UseClickOutside(popupRef, () => setOpened(false));
    return (
      <div ref={popupRef} className="relative mr-4 ">
        <button
          onClick={() => setOpened(!opened)}
          className={`${
            opened ? "bg-amber-300" : "bg-amber-200"
          }  flex h-fit flex-row items-center justify-center gap-1 rounded-lg p-1 shadow-lg  transition-colors duration-300`}
        >
          <div className="flex items-center justify-center rounded-full border border-gray-600 p-1">
            <PlusIcon size={15} />
          </div>
          <span>Stwórz</span>
        </button>
        {opened && (
          <div className="absolute right-4 top-16 z-20 w-52  rounded-xl bg-white shadow-lg ">
            <div className="flex h-full  w-full  flex-col justify-center  p-3">
              <Link
                href={"/drafts"}
                className=" text-md mb-2  flex flex-row items-center justify-center rounded-xl p-1 shadow-md active:shadow-sm"
              >
                <div className="w-4/5">
                  Wybierz wersję roboczą quizu do dokończenia
                </div>{" "}
                <div className=" rounded-md border-2 border-gray-600 p-[3px] ">
                  <EditIcon size={15} />
                </div>
              </Link>
              <Link
                href={"/create"}
                className=" text-md mt-2 flex flex-row items-center  justify-center rounded-xl p-1 shadow-md active:shadow-sm "
              >
                <div className="w-4/5">Stwórz nowy quiz</div>{" "}
                <div className=" rounded-md border-2 border-gray-600 p-[3px] ">
                  <PlusIcon size={15} />
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <nav className="sticky  top-0 z-20 flex h-[4.5rem] w-full items-center justify-between   bg-teal-300">
      <Link href={"/"} className="ml-1 flex items-center justify-center ">
        <LogoIcon />
      </Link>
      <CreateQuiz />
    </nav>
  );
}
