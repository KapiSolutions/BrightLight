import '../styles/main.scss'
import Layout from '../components/layout/Main/Layout'
import "@fontsource/k2d"
import "@fontsource/ms-madi"


function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)

  return (
      getLayout(<Component {...pageProps} />)
  )
}

export default MyApp
