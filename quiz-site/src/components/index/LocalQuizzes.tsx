import { QuizzesView } from "./QuizzesView";

type quiz = {
  title: string | null;
  description: string | null;
  image: string | null;
  id: string | null;
  _count: {
    questions: number;
  } | null;
};
export function LocalQuizzes() {
  const quizIds = localStorage.getItem("quizIds");
  if (!quizIds) {
    return null;
  }
  try {
    const parsedQuizIds = JSON.parse(quizIds) as string[];
    const quizData = [];
    for (let i = 0; i < 3; i++) {
      const quiz = localStorage.getItem(`quiz_${parsedQuizIds[i]}`);
      if (quiz) {
        const parsedQuiz = JSON.parse(quiz) as quiz;
        parsedQuiz.id = parsedQuizIds[i]!;
        quizData.push(parsedQuiz);
      }
    }
    return <QuizzesView data={quizData} type="local" />;
  } catch (e) {
    console.log(e);
    return null;
  }
}
