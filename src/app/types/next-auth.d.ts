import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth'{
    interface User {
        _id? : string,
        email? : string,
        name? : string,
        picture? : string ,
    }
    interface Session{
        user : {
                id? : string,
                email? : string,
                name? : string,
                picture? : string ,
                } & DefaultSession['user']
    }
}

declare module 'nect-auth/jwt'{
    interface JWT{
        id? : string,
        email? : string,
        name? : string,
        picture? : string
    }
}