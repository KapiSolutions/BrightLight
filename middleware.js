// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'
// import absoluteUrl from 'next-absolute-url'

export default function middleware(req){
    const publicRoutes = ['/','/about','/sign-in','/register','/404']
    // const { origin } = absoluteUrl(req)
    const origin = 'https://bright-light.vercel.app'
    const verify = req.cookies.get('userLoggedIn')
    const url = req.url
    const path = url.replace(origin, '') 
    console.log('verify: ', verify)

    if(!verify && !publicRoutes.includes(path) && !path.includes('.')){
        console.log('restricted')
        return NextResponse.redirect(`${origin}/sign-in`)
    }

    return NextResponse.next()
}