import {User} from 'next-auth'
import { NextRequest ,NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getServerSession } from 'next-auth'
import UserModel from '@/model/User.model'
import { authOptions } from '../auth/[...nextauth]/options'


export async function GET(request : NextRequest){

    // db coonect 

    const session = await getServerSession(authOptions)
    const user : User = await session?.user as User
    const loginByGithub  = (session?.user as any)?.isGithub 
    const githubAccessToken  = (session?.user as any)?.githubAccessToken 
    
    if (!session || !user) {
        return NextResponse.json({
            success : false,
            message : "Not Autenticated"
        })
    }



}