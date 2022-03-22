import '../styles/globals.css';

import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <link rel="icon" sizes="3232" href="/images/NYT-Wordle-Icon-32.png"/>
      <link rel="apple-touch-icon" href="/images/NYT-Wordle-Icon-192.png"/>
    </Head>

    <Component {...pageProps} />
  </>;
}

export default MyApp
