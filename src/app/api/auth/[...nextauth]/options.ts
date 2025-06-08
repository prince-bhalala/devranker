import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import UserModel from "../../../../model/User.model";

export const  authOptions : NextAuthOptions = {

    providers : [
        GitHubProvider({
            clientId: process.env.GITHUB_ID! ,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID! ,
            clientSecret: process.env.GOOGLE_SECRET!
        }),

    ],
    callbacks : {
        async jwt({token,user}){
            if (user) {
                token.id = user.id.toString()
                token.email  = user.email,
                token.name = user.name,
                token.picture = user.image
            }
            return token
        },

        async session({session  , token}){
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.image = token.picture as string
            }
            return session
        },

        async signIn ({user , account}) {
            //await dbconnect()

            const existingUser = await UserModel.findOne({email : user.email})

            if (existingUser) {
                existingUser.lastLogin = Date.now()
                await existingUser.save()
            }else{
                await UserModel.create({
                    name : user.name,
                    email : user.email,
                    image : user.image,
                    provider : account?.provider,
                    lastLogin : Date.now()  
                })
            }

            return true
        }
    },
    pages  : {
        signIn : '/sign-in'
    },
    session : {
        strategy : 'jwt'
    },

    secret : process.env.NEXTAUTH_SECRET

}