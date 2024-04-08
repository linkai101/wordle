import '../styles/globals.css';

import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <link rel="icon" sizes="3232" href="/images/NYT-Wordle-Icon-32.png"/>
      <link rel="apple-touch-icon" href="/images/NYT-Wordle-Icon-192.png"/>
      <title>Wordle Archive</title>
      <meta name="description" content="Play today's and previous Wordles, all in one familiar interface." />
    </Head>

    <Component {...pageProps} />
  </>;
}

export default MyApp
