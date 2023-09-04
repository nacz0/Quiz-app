enum QuestionType {
  ANSWERS = "answers",
  TRUE_FALSE = "true_false",
  INPUT = "input",
  SLIDER = "slider",
}

export const defaultQuizValues = {
  quiz: {
    title: "",
    description: "",
    image: "",
  },
  questions: [
    {
      text: "",
      ytLink: "",
      image: "",
      answerTime: "20",
      type: QuestionType.ANSWERS,
      answers: [
        {
          text: "",
          isCorrect: false,
          image: "",
        },
        {
          text: "",
          isCorrect: false,
          image: "",
        },
        {
          text: "",
          isCorrect: false,
          image: "",
        },
        {
          text: "",
          isCorrect: false,
          image: "",
        },
      ],
    },
  ],
};
