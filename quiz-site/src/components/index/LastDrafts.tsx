import { api } from "~/utils/api";
import { QuizzesView } from "./QuizzesView";
export function LastDrafts() {
  const { data } = api.search.getUserDrafts.useQuery(undefined, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return <QuizzesView data={data} type="draft" />;
}
