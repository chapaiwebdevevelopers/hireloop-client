"use client"

import * as React from "react"
import Link from "next/link"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthMode = "sign-in" | "sign-up"

const copy: Record< AuthMode,{
    title: string
    subtitle: string
    cta: string
    prompt: string
    promptLink: string
    switchTo: AuthMode
  }
> = {
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to your HireLoop account",
    cta: "Sign In",
    prompt: "Don't have an account?",
    promptLink: "Create one",
    switchTo: "sign-up",
  },
  "sign-up": {
    title: "Create your account",
    subtitle: "Start finding your dream job today",
    cta: "Create Account",
    prompt: "Already have an account?",
    promptLink: "Sign in",
    switchTo: "sign-in",
  },
}
const roles= ["seeker", "recruiter", "admin"]
function Logo() {
  return (
    <Link
      href="/"
      className="font-heading text-xl font-bold tracking-tight md:text-2xl"
    >
      <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-orange-500 bg-clip-text text-transparent">
        hireloop
      </span>
      <span className="sr-only">HireLoop home</span>
    </Link>
  )
}

export function AuthForm({ mode, onSubmit }: {
  mode: AuthMode
  onSubmit: (payload: Record<string, FormDataEntryValue>) => void | Promise<void>
}) {
  const { title, subtitle, cta, prompt, promptLink, switchTo } = copy[mode]
  const [showPassword, setShowPassword] = React.useState(false)

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    // TODO: wire up better-auth here
    // mode === "sign-in" → authClient.signIn.email(payload)
    // mode === "sign-up" → authClient.signUp.email(payload)
    // if (mode === "sign-in" ){

    // }
    await onSubmit?.(payload)
    console.log(`[${mode}] form data:`, payload)
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#050507] px-4 py-12 text-zinc-100">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(101,94,255,0.12),transparent_70%)]"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 text-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl shadow-black/40 backdrop-blur-sm sm:p-8">
          <h1 className="font-heading text-2xl font-semibold text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-4"
            noValidate={false}
          >
            {mode === "sign-up" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-zinc-300">
                  Full name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Jane Doe"
                  className="h-10 border-zinc-800 bg-zinc-950/60 text-sm placeholder:text-zinc-600"
                />
              </div>
            )}

            {mode === "sign-up" && (
              <div className="flex flex-col gap-2">
                <Label className="text-zinc-300">I am a</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <label
                      key={role}
                      className="flex cursor-pointer items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/60 px-2 py-2 text-sm capitalize text-zinc-400 transition-colors has-checked:border-primary has-checked:bg-primary/10 has-checked:text-white hover:border-zinc-700"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        defaultChecked={role === "seeker"}
                        className="sr-only"
                        required
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-10 border-zinc-800 bg-zinc-950/60 text-sm placeholder:text-zinc-600"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="h-10 border-zinc-800 bg-zinc-950/60 pr-10 text-sm placeholder:text-zinc-600"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute top-1 right-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="mt-2 h-10 rounded-xl text-sm">
              {cta}
            </Button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <p className="mt-6 text-center text-sm text-zinc-400">
            {prompt}{" "}
            <Link
              href={switchTo === "sign-in" ? "/sign-in" : "/sign-up"}
              className="font-medium text-primary hover:underline"
            >
              {promptLink}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
