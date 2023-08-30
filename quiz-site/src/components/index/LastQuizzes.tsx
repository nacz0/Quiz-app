import { api } from "~/utils/api";
import Image from "next/image";
import { BgIcon } from "~/svg/bg";
import { LogoIcon } from "~/svg/logo";
export function LastQuizzes() {
  const { data, isLoading } = api.search.getUserQuizzes.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  if (isLoading || !data || data.length === 0) {
    return null;
  }
  console.log(data);

  return (
    <div className="flex w-full flex-col gap-5 rounded-lg bg-teal-50 p-5 font-normal">
      <span className="text-xl font-bold">Twoje ostatnio stworzone quizy:</span>
      <div className="flex flex-col gap-2">
        {data.map((quiz) => (
          <div
            className="flex flex-row justify-between  rounded-sm border border-gray-600 "
            key={quiz.id}
          >
            <div className="flex flex-col justify-between">
              <div className="line-clamp-2   w-4/5 text-ellipsis   px-3   text-lg font-semibold ">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                ng elit. Aenean
              </div>
              <div className="h-4 w-full bg-teal-100 ">
                <div className="ml-3 text-xs font-medium">
                  {quiz._count.questions}{" "}
                  {quiz._count.questions > 1 ? "pytań" : "pytanie"}
                </div>
              </div>
            </div>
            {quiz.image ? (
              <div>
                <div className="relative  flex h-20 w-20 items-center  ">
                  <Image
                    className=" object-cover "
                    src={quiz.image}
                    alt={quiz.title}
                    fill={true}
                  ></Image>
                </div>
              </div>
            ) : (
              <div className="relative  flex h-20 w-20 items-center opacity-70">
                <BgIcon />
                <div className="absolute flex h-full w-full items-center justify-center">
                  <div>
                    <LogoIcon />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
