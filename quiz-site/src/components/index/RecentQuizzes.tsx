import { api } from "~/utils/api";
import { QuizzesView } from "./QuizzesView";
export function RecentQuizzes() {
  const { data } = api.search.getRecentQuizzes.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return <QuizzesView data={data} type="recent" />;
}
