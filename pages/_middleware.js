import { NextResponse } from "next/server";
import absoluteUrl from 'next-absolute-url'

export default function middleware(req){
    const publicRoutes = ['/','/about','/sign-in','/register','/404']
    const { origin } = absoluteUrl(req)
    const verify = req.cookies
    const url = req.url
    const path = url.replace(origin, '')

    if(!verify?.userLoggedIn && !publicRoutes.includes(path) && !path.includes('.')){
        return NextResponse.redirect(`${origin}/sign-in`)
    }

    return NextResponse.next()
}