import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";

import { getDataFromTree } from "@apollo/client/react/ssr";
import { getApolloClient } from "../data/apollo.js";

export default class MyDocument extends Document {
  // Reference: https://gist.github.com/Tylerian/16d48e5850b407ba9e3654e17d334c1e
  constructor(props) {
    super(props);

    /**
     * Attach apolloState to the "global" __NEXT_DATA__ so we can populate the ApolloClient cache
     */
    const { __NEXT_DATA__, apolloState } = props;
    __NEXT_DATA__.apolloState = apolloState;
  }

  static async getInitialProps(ctx) {
    console.clear();

    const startTime = Date.now();

    /**
     * Initialize and get a reference to ApolloClient, which is saved in a "global" variable.
     * The same client instance is returned to any other call to `getApolloClient`, so _app.js gets the same authenticated client to give to ApolloProvider.
     */
    const apolloClient = getApolloClient(true);

    /**
     * Render the page through Apollo's `getDataFromTree` so the cache is populated.
     * Unfortunately this renders the page twice per request... There may be a way around doing this, but I haven't quite ironed that out yet.
     */
    await getDataFromTree(<ctx.AppTree {...ctx.appProps} />);

    /**
     * Render the page as normal, but now that ApolloClient is initialized and the cache is full, each query will actually work.
     */
    const initialProps = await Document.getInitialProps(ctx);

    /**
     * Extract the cache to pass along to the client so the queries are "hydrated" and don't need to actually request the data again!
     */
    const apolloState = apolloClient.extract();

    console.info(`Render Time: ${Date.now() - startTime} milliseconds.`);

    return { ...initialProps, apolloState };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  };
};
