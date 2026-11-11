'use client'
import { AuthForm } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client"



export default function SignUpPage() {
    const handleSignUp=async(payload: Record<string, FormDataEntryValue>)=>{    
      const { data, error } = await authClient.signUp.email({
        email: payload.email as string,
        password: payload.password as string,
        name: payload.name as string,
        image: payload.image as string,
        role: (payload.role as string) ?? "seeker",
        callbackURL: "/",
      })
    }
  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />
}
