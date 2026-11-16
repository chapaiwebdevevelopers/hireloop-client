'use client'
import { AuthForm } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"
import { useRouter, useSearchParams } from 'next/navigation'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'
  console.log(redirectTo)
  const router = useRouter()
  const handleSignIn = async (payload: Record<string, FormDataEntryValue>): Promise<void> => {
    const { data, error } = await authClient.signIn.email({
      email: payload.email as string,
      password: payload.password as string,
      rememberMe:true,
      callbackURL:redirectTo,
    })
    if (error) {
      toast.add({
        title: "Sign in failed",
        description: error.message ?? "Something went wrong. Please try again.",
      })
      return
    }
    
  }
  return <AuthForm mode="sign-in" onSubmit={handleSignIn} />
}
