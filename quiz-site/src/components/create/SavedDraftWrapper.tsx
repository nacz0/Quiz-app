import { api } from "~/utils/api";
import { QuizWizard } from "./QuizWizard";

export function SavedDraftWrapper(props: { id: string }) {
  const { id } = props;
  const { data, isLoading } = api.quiz.getDraftQuizById.useQuery(id, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  if (isLoading) {
    return <div>loading...</div>;
  }
  if (!data) {
    return <div>404</div>;
  }
  return <QuizWizard alreadySaved={true} draftData={data} />;
}
