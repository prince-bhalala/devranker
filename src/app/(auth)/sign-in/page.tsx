'use client'
import Link from "next/link"
import { signIn } from "next-auth/react"


export default function LoginPage(){
    const providers =  [
    { name: 'Google', id: 'google', color: 'bg-red-500' },
    { name: 'GitHub', id: 'github', color: 'bg-gray-800' },
    { name: 'LinkedIn', id: 'linkedin', color: 'bg-blue-700' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-6 text-center">Sign in to Your Account</h2>
            {
                providers.map( (provider) => (
                    <button 
                        key={provider.id}
                        onClick={ () => signIn(provider.id,{callbackUrl : '/'})} 
                        className={`w-full text-white ${provider.color} py-2 px-4 rounded-md mb-4 hover:opacity-90`}>

                    Sign in With {provider.name}
                    </button>
                ))
            }
        </div>
    </div>
  )
}