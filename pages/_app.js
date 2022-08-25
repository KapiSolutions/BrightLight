import '../styles/main.scss'
import "@fontsource/k2d"
import "@fontsource/ms-madi"
import Layout from '../components/layout/Main/Layout'
import AuthProvider from '../context/AuthProvider'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)

  return (
    <AuthProvider>
          {getLayout(<Component {...pageProps} />)}
    </AuthProvider>
  )
}

export default MyApp
