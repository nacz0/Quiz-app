export type gameStates =
  | "lobby"
  | "loading"
  | "playing"
  | "waiting"
  | "finished"; //game cycle: lobby -> [loading -> playing -> waiting ->]*numberOfQuestions -> finished
