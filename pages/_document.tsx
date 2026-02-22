import type { DocumentContext, DocumentInitialProps } from 'next/document'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render() {
    return (
      <Html lang="nl">
        <Head>
          <link rel="icon" type="image/jpeg" href="/images/logo.jpg" />
          <link rel="shortcut icon" type="image/jpeg" href="/images/logo.jpg" />
          <link rel="apple-touch-icon" href="/images/logo.jpg" />
          <meta name="theme-color" content="#10B981" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
