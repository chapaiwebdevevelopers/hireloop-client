import Image from "next/image"
import Link from "next/link"
import { BriefcaseBusinessIcon, MapPinIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import heroGlobe from "@/app/images/hero-globe.png"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "DevOps Engineer",
]

/** Deterministic starfield (fixed positions, no hydration mismatch) */
const starLayers = [
  "radial-gradient(1px 1px at 25px 35px, rgba(255,255,255,0.65) 50%, transparent 52%)",
  "radial-gradient(1px 1px at 120px 190px, rgba(255,255,255,0.35) 50%, transparent 52%)",
  "radial-gradient(1.5px 1.5px at 300px 90px, rgba(255,255,255,0.5) 50%, transparent 52%)",
  "radial-gradient(1px 1px at 220px 280px, rgba(255,255,255,0.28) 50%, transparent 52%)",
  "radial-gradient(1.5px 1.5px at 380px 230px, rgba(255,255,255,0.42) 50%, transparent 52%)",
  "radial-gradient(1px 1px at 45px 310px, rgba(255,255,255,0.3) 50%, transparent 52%)",
].join(", ")

export function Hero() {
  return (
    <section
      id="hero"
      className="relative z-10 -mt-16 overflow-hidden bg-[#050507] pt-16 text-zinc-100"
    >
      {/* Subtle purple ambient tint at the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(101,94,255,0.10),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-20 pb-4 text-center sm:px-6 md:pt-28 lg:px-8">
        {/* Announcement badge */}
        <div className="flex items-center justify-center gap-4">
          <span
            aria-hidden
            className="hidden h-px w-20 bg-gradient-to-r from-transparent to-zinc-700 sm:block"
          />
          <div className="flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/80 py-1.5 pr-4 pl-1.5 shadow-lg shadow-black/40">
            <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600">
              <BriefcaseBusinessIcon className="size-3.5 text-white" />
            </span>
            <span className="font-mono text-base font-bold tracking-tight text-zinc-100">
              50,000+
            </span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">
              New jobs this month
            </span>
          </div>
          <span
            aria-hidden
            className="hidden h-px w-20 bg-gradient-to-l from-transparent to-zinc-700 sm:block"
          />
        </div>

        {/* Headline */}
        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Find Your Dream Job Today
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <form
          action="/jobs"
          method="get"
          role="search"
          className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-2 shadow-xl shadow-black/40 backdrop-blur-sm sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2.5 px-2.5">
            <SearchIcon
              aria-hidden
              className="size-4 text-zinc-500 shrink-0"
            />
            <Input
              type="search"
              name="q"
              aria-label="Job title, skill or company"
              placeholder="Job title, skill or company"
              className="h-9 border-0 bg-transparent px-0 text-sm placeholder:text-zinc-500 focus-visible:border-transparent focus-visible:ring-0"
            />
          </div>
          <Separator
            orientation="vertical"
            className="hidden h-7 bg-zinc-800 sm:block"
          />
          <div className="flex flex-1 items-center gap-2.5 px-2.5">
            <MapPinIcon
              aria-hidden
              className="size-4 text-zinc-500 shrink-0"
            />
            <Input
              name="location"
              aria-label="Location or Remote"
              placeholder="Location or Remote"
              className="h-9 border-0 bg-transparent px-0 text-sm placeholder:text-zinc-500 focus-visible:border-transparent focus-visible:ring-0"
            />
          </div>
          <Button
            type="submit"
            size="icon-lg"
            aria-label="Search jobs"
            className="rounded-xl"
          >
            <SearchIcon aria-hidden />
          </Button>
        </form>

        {/* Trending positions */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span className="text-xs text-zinc-500">Trending Position</span>
          {trendingPositions.map((position) => (
            <Link
              key={position}
              href={`/jobs?q=${encodeURIComponent(position)}`}
              className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
            >
              {position}
            </Link>
          ))}
        </div>
      </div>

      {/* Globe visual */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ backgroundImage: starLayers, backgroundSize: "420px 420px" }}
        />
        <Image
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          src={heroGlobe}
          alt=""
          aria-hidden
          className="relative mx-auto block w-full max-w-2xl sm:max-w-3xl md:max-w-5xl lg:max-w-6xl"
        />
        <p className="absolute inset-x-0 bottom-[11%] px-4 text-center font-heading text-xl text-zinc-300/90 sm:text-2xl md:text-3xl">
          Assisting over{" "}
          <span className="font-semibold text-white">15,000 job seekers</span>{" "}
          find their dream positions.
        </p>
      </div>
    </section>
  )
}
