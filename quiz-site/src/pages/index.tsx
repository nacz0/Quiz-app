import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "~/components/Navbar";
import { LastQuizzes } from "~/components/index/LastQuizzes";
import { LocalQuizzes } from "~/components/index/LocalQuizzes";
import { api } from "~/utils/api";

export default function Home() {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Quizzer</title>
        <meta name="description" content="An quiz app for quizzers alike" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <div className=" flex   flex-col items-center  overflow-auto bg-white">
          <div className="mt-4 flex  h-full w-full flex-col items-center gap-2 px-4 ">
            {sessionData && (
              <>
                <div className="w-full rounded-lg bg-teal-50 p-5  text-xl font-normal">
                  Witaj z powrotem,{" "}
                  <Link
                    href={`users/${sessionData.user.id}`}
                    className=" text-amber-500"
                  >
                    {sessionData.user.name}
                  </Link>
                  !
                </div>

                <LastQuizzes />
                <LocalQuizzes />
              </>
            )}
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl ">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black  no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
