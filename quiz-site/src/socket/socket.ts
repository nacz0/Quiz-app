import { io, type Socket } from "socket.io-client";
import type { question } from "../components/start/Start";
interface ServerToHostClientEvents {
  user_joined: (username: string) => void;
  user_left: (username: string) => void;
  answer_sent: (username: string, answer: number) => void;
  game_started: (pin: string) => void;
}
interface ServerToUserClientEvents {
  is_valid_user: (b: boolean) => void;
  game_started_client: () => void;
  next_question_client: () => void;
  next_data_client: (question: question) => void;
  end_question_client: () => void;
  game_ended_client: () => void;
}
interface HostClientToServerEvents {
  start_game: (quizId: string) => void;
  end_game: (pin: string) => void;
  next_question: (pin: string) => void;
  next_data: (pin: string, question: question) => void;
  end_question: (pin: string) => void;
}

interface UserClientToServerEvents {
  join_game: (pin: string, username: string) => void;
  send_answer: (pin: string, username: string, answer: number) => void;
}
interface Events
  extends ServerToHostClientEvents,
    ServerToUserClientEvents,
    HostClientToServerEvents,
    UserClientToServerEvents {}
export const socket: Socket<Events> = io("ws://192.168.1.42:8000");
