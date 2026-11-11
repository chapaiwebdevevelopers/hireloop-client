'use client'
import { AuthForm } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client"


export default function SignInPage() {
  const handleSignIn = async (payload: Record<string, FormDataEntryValue>): Promise<void> => {
    const {data, error}= await authClient.signIn.email({
      email: payload.email as string,
      password: payload.password as string,

    })
  }
  return <AuthForm mode="sign-in" onSubmit={handleSignIn} />
}
