import { api } from "~/utils/api";
import { QuizzesView } from "./QuizzesView";
export function LastQuizzes() {
  const { data, isLoading } = api.search.getUserQuizzes.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  if (isLoading || !data || data.length === 0) {
    return null;
  }
  return <QuizzesView data={data} type="api" />;
}
