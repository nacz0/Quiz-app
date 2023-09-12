import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Start } from "~/components/start/Start";
import { api } from "~/utils/api";
const PlayPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.search.getQuizById.useQuery({ id });
  if (isLoading) {
    console.log("loading");
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>404</div>;
  }
  return (
    <>
      <Head>
        <title>Quizzer</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-200">
        <Start quizId={id} data={data} />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context.params?.id;

  if (typeof id !== "string") {
    throw new Error("no id");
  }
  return {
    props: {
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default PlayPage;
