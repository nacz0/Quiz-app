import { api } from "~/utils/api";
export function LastQuizzes() {
  const { data, isLoading } = api.search.getUserQuizzes.useQuery();
  if (isLoading || !data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-lg bg-teal-50 p-5 font-normal">
      <span className="text-xl">Twoje ostatnio stworzone quizy:</span>
      {data.map((quiz) => (
        <div className="flex flex-row" key={quiz.id}>
          <div className="text-lg font-semibold">{quiz.title}</div>
          <div>{quiz.image}</div>
        </div>
      ))}
    </div>
  );
}
