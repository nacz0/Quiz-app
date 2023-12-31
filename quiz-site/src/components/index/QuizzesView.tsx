import Image from "next/image";
import Link from "next/link";
import { BgIcon } from "~/svg/bg";
import { LogoIcon } from "~/svg/logo";

type data = {
  title: string | null;
  description: string | null;
  image: string | null;
  id: string | null;
  user?: {
    name: string | null;
  } | null;
  _count: {
    questions: number;
  } | null;
}[];

export function QuizzesView(props: {
  data: data | null | undefined;
  type: "quiz" | "draft" | "recent";
}) {
  const { data, type } = props;

  function ImageView(props: {
    image: string | null | undefined;
    title: string | null | undefined;
  }) {
    return (
      <>
        {props.image ? (
          <div className="relative  flex h-20 w-20 items-center  ">
            <Image
              className=" object-cover "
              src={props.image}
              alt={props.title ?? "Quiz image"}
              fill={true}
            ></Image>
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
      </>
    );
  }
  function Quiz(props: { quiz: data[number] | undefined }) {
    const { quiz } = props;
    function QuizContent() {
      return (
        <>
          <div className="flex  basis-4/5 flex-col justify-between ">
            <div className="mt-1 line-clamp-2 flex w-4/5    text-ellipsis break-all    px-3   text-lg font-semibold ">
              {quiz ? (
                quiz.title !== "" ? (
                  quiz.title
                ) : (
                  "Bez tytułu"
                )
              ) : (
                <div className="mt-2 h-4 w-full animate-pulse bg-gray-500 "></div>
              )}
            </div>
            <div className="flex h-4 w-full bg-teal-100/80 ">
              {quiz ? (
                <>
                  {quiz._count && (
                    <div className="ml-3 text-xs font-medium">
                      {quiz._count.questions}{" "}
                      {quiz._count.questions > 1 ? "pytań" : "pytanie"}
                    </div>
                  )}
                  {quiz.user && (
                    <div className="ml-3 flex flex-row items-center text-xs    font-bold ">
                      <div className="mr-3 h-3 border-l border-gray-700"></div>
                      {quiz.user.name}
                    </div>
                  )}
                </>
              ) : (
                <div className="ml-3 mt-1 h-2 w-40 animate-pulse bg-gray-500 text-xs font-medium"></div>
              )}
            </div>
          </div>
          <ImageView image={quiz?.image} title={quiz?.title} />
        </>
      );
    }
    return (
      <>
        {quiz ? (
          <Link
            href={`quiz/${quiz?.id}`}
            className=" box-content flex h-20  flex-row justify-between  overflow-hidden rounded-xl border border-gray-600 "
          >
            <QuizContent />
          </Link>
        ) : (
          <div className=" box-content flex h-20  flex-row justify-between  overflow-hidden rounded-xl border border-gray-600 ">
            <QuizContent />
          </div>
        )}
      </>
    );
  }

  function View(props: { data: data | undefined | null }) {
    const { data } = props;
    return (
      <div className="flex w-full flex-col gap-5 	  rounded-lg bg-white p-5 font-normal shadow-md">
        <span className="text-xl font-bold">
          {type === "quiz" && "Twoje ostatnio stworzone quizy:"}
          {type === "draft" && "Twoje wersje robocze quizzów:"}
          {type === "recent" && "Ostatnio stworzone quizzy:"}
        </span>
        <div className="flex flex-col gap-2">
          {data
            ? data.map((quiz) => <Quiz quiz={quiz} key={quiz.id} />)
            : [1, 2, 3].map((num) => <Quiz quiz={undefined} key={num} />)}
        </div>
      </div>
    );
  }
  return <View data={data} />;
}
