import Image from "next/image";
import { api } from "~/utils/api";

export function QuizView(props: { id: string }) {
  const { id } = props;
  const { data: quiz, isLoading } = api.search.getQuizById.useQuery({ id });
  if (isLoading) {
    console.log("loading");
    return <div>loading...</div>;
  }
  if (!quiz) {
    return <div>404</div>;
  }
  return (
    <div>
      <div>{quiz.title}</div>
      <div>{quiz.description}</div>
      {quiz.image && (
        <Image width={100} height={100} src={quiz.image} alt="quiz image" />
      )}
    </div>
  );
}
