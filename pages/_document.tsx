import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Bank Statement Converter Pro</title>
        <meta name="description" content="Convert PDF bank statements to Excel/CSV with AI-powered data extraction" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
