import Head from "next/head";
import { QuizWizard } from "~/components/create/QuizWizard";

export default function Create() {
  return (
    <>
      <Head>
        <title>Quizzer</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <QuizWizard alreadySaved={false} />
    </>
  );
}
