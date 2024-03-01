import { Children } from 'react';
import createEmotionCache from '../utils/createEmotionCache';
import { inter, roboto, plusJakartaSans } from '../styles/fonts';
import createEmotionServer from '@emotion/server/create-instance';
import Document, { Html, Main, NextScript, Head } from 'next/document';

const Favicon = () => (
  <>
    <link
      rel='apple-touch-icon'
      sizes='180x180'
      href='/apple-touch-icon.png'
    />
    <link
      rel='icon'
      href='/dynamox-icon.png'
    />
  </>
);

class MyDocument extends Document {
  render() {
    return (
      <Html
        lang='en'
        className={`${inter.className} ${roboto.className} ${plusJakartaSans.className}`}
      >
        <Head>
          <Favicon />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () => originalRenderPage({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enhanceApp: (App: any) => (props) => (
      <App
        emotionCache={cache}
        {...props}
      />
    )
  });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
  };
};

export default MyDocument;
