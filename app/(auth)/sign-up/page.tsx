'use client'
import { AuthForm } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client"



export default function SignUpPage() {
    const handleSignUp=async(payload: Record<string, FormDataEntryValue>)=>{    
      const { data, error } = await authClient.signUp.email({
        email: String(payload.email ?? ""),
        password: String(payload.password ?? ""),
        name: String(payload.name ?? ""),
        image: typeof payload.image === "string" ? payload.image : undefined,
        callbackURL: "/",
      })
    }
  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />
}
