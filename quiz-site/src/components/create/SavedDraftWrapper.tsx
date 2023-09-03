import { api } from "~/utils/api";
import { QuizWizard } from "./QuizWizard";

export function SavedDraftWrapper(props: { id: string }) {
  const { id } = props;
  const { data, isLoading } = api.quiz.getDraftQuizById.useQuery(id);
  if (isLoading) {
    return <div>loading...</div>;
  }
  if (!data) {
    return <div>404</div>;
  }
  return <QuizWizard alreadySaved={false} draftData={data} />;
}
