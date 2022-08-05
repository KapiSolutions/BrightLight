import '../styles/main.scss'
import "@fontsource/k2d"
import "@fontsource/ms-madi"
import Layout from '../components/layout/Main/Layout'
import AuthProvider from '../context/AuthProvider'
import { useRouter } from 'next/router'
import ProtectedRoute from '../components/ProtectedRoute'

const noAuthRequired = ['/', '/sign-in', '/register', '/404', '/blog']

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)
  const router = useRouter()

  return (
    <AuthProvider>

          {getLayout(<Component {...pageProps} />)}

    </AuthProvider>
  )
}

export default MyApp
