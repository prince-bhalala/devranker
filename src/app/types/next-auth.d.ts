
import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      email?: string
      name?: string
      picture?: string
      isGithub?: string
      linkedinAccessToken?: string
      linkedinProfileUrl?: string
      githubAccessToken?: string
    } & DefaultSession['user']
  }

  interface User {
    _id?: string
    email?: string
    name?: string
    picture?: string
    isGithub?: string
    linkedinAccessToken?: string
    linkedinProfileUrl?: string
    githubAccessToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    email?: string
    name?: string
    picture?: string
    isGithub?: string
    linkedinAccessToken?: string
    linkedinProfileUrl?: string
    githubAccessToken?: string
  }
}
