'use client'
import { AuthForm } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { useRouter } from 'next/navigation'



export default function SignUpPage() {
  const router=useRouter()
    const handleSignUp=async(payload: Record<string, FormDataEntryValue>)=>{
      const { data, error } = await authClient.signUp.email({
        email: payload.email as string,
        password: payload.password as string,
        name: payload.name as string,
        role: (payload.role as string) ?? "seeker",
        callbackURL: "/",
      })
      if(error){
        toast.add({
          title: "Sign up failed",
          description: error.message ?? "Something went wrong. Please try again.",
        })
        return
      }
      router.push('/')
    }
  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />
}
