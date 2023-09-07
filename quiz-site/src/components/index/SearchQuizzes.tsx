import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";
type search = {
  query: string;
};
export function SearchQuizzes() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<search>({
    resolver: zodResolver(z.object({ query: z.string().min(1).max(250) })),
  });
  const router = useRouter();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log(data);
        await router.push(`/search?query=${data.query}`);
      })}
      className="flex w-full flex-col gap-5 rounded-lg bg-white p-5 font-normal shadow-md"
    >
      <span className="text-xl font-bold">Szukaj quizów</span>

      <input
        className="rounded-full bg-white/50 px-10 py-3 font-semibold  no-underline shadow-lg transition  duration-200 hover:bg-white/90 active:shadow-md"
        placeholder="Szukaj quizów"
        {...register("query")}
      />
    </form>
  );
}
