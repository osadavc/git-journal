import WiredElements from "@/components/Common/WiredElements";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Git Journal | Your Journal, Your Life</title>
      </Head>
      <WiredElements />
      <Component {...pageProps} />
    </>
  );
};

export default App;
