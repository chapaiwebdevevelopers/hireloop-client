import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  baseURL:process.env.BETTER_AUTH_URL,
  plugins: [
    // Pulls the server's additionalFields (e.g. user.role) into client types
    inferAdditionalFields<typeof auth>(),
  ],
})
export const { signIn, signUp, useSession,signOut } = authClient