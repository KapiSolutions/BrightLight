// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'

export default function middleware(req){
    // const publicRoutes = ['/','/about','/sign-in','/register','/404']
    const origin = process.env.VERCEL_URL
    // const origin = 'https://bright-light.vercel.app'
    console.log('origin: ', origin)
    // const verify = !!req.cookies.get('userLoggedIn')
    // const url = req.url
    // const path = url.replace(origin, '') 
    

    // if(!verify  && !path.includes('.')){
    //     console.log('restricted')
    //     return NextResponse.redirect(`${origin}/sign-in`)
    // }

    return NextResponse.next()
}

export const config = {
    matcher: ['/blog/:path*']
    // matcher: ['/blog/:path*', '/api/admin/:path*']
};