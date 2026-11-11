"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Menu } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
]

const initialLinks = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Get Started", href: "/sign-up" },
]

function Logo() {
  return (
    <Link
      href="/"
      className="font-heading text-xl font-bold tracking-tight md:text-2xl"
    >
      <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-orange-500 bg-clip-text text-transparent">
        hireloops 
      </span>
      <span className="sr-only">HireLoop home</span>
    </Link>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900 text-zinc-100 dark:border-border dark:bg-zinc-950">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop nav links */}
        <nav
          data-slot="navbar-links"
          className="hidden items-center gap-1 md:flex"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors hover:text-white",
                pathname === link.href
                  ? "font-medium text-white"
                  : "text-zinc-300"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth actions */}
        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="h-8 w-40 animate-pulse rounded-md bg-zinc-800" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="mr-1 ring-2 ring-zinc-700">
                  {user.image ? <AvatarImage src={user.image} /> : null}
                  <AvatarFallback className="bg-zinc-800 text-zinc-100">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">{user.name ?? "User"}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Separator
                orientation="vertical"
                className="mx-1 hidden h-5 bg-zinc-700 lg:block"
              />
              <Link
                href={initialLinks[0].href}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Button
                render={<Link href={initialLinks[1].href} />}
                className="rounded-full px-4"
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-200 hover:bg-zinc-800 hover:text-white md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent className="bg-zinc-900 text-zinc-100">
            <SheetHeader>
              <SheetTitle className="text-left">
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav
              className="flex flex-col gap-1 px-4"
              aria-label="Main mobile"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm transition-colors hover:bg-zinc-800 hover:text-white",
                    pathname === link.href
                      ? "bg-zinc-800 font-medium text-white"
                      : "text-zinc-300"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 border-t border-zinc-800 p-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      {user.image ? <AvatarImage src={user.image} /> : null}
                      <AvatarFallback className="bg-zinc-800 text-zinc-100">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {user.name ?? "User"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <SheetClose
                    render={
                      <Button
                        variant="outline"
                        className="mt-2 w-full border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800"
                        onClick={handleSignOut}
                      />
                    }
                  >
                    <LogOut />
                    Sign out
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose
                    render={
                      <Link
                        href={initialLinks[0].href}
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                          }),
                          "w-full border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800"
                        )}
                      />
                    }
                  >
                    Sign In
                  </SheetClose>
                  <SheetClose
                    render={
                      <Link
                        href={initialLinks[1].href}
                        className={cn(
                          buttonVariants(),
                          "w-full rounded-full"
                        )}
                      />
                    }
                  >
                    Get Started
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
