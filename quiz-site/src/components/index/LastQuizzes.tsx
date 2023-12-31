import { api } from "~/utils/api";
import { QuizzesView } from "./QuizzesView";
export function LastQuizzes() {
  const { data } = api.search.getUserQuizzes.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return <QuizzesView data={data} type="quiz" />;
}
