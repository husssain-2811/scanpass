import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ScanPass - Visual Authentication</title>
        <meta name="description" content="Login using personalized objects" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔐</text></svg>" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;