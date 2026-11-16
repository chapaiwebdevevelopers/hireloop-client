"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Search toolbar for the jobs archive page.
 *
 * Frontend-only logic: the search term is stored in the URL query string
 * (?search=...) so the Server Component page re-renders with new params.
 * No backend code is touched here.
 */

/** Builds the next /jobs URL from the current params */
const buildJobsUrl = (
  pathname: string,
  searchParams: URLSearchParams,
  set: Record<string, string>,
) => {
  const params = new URLSearchParams(searchParams.toString());
  console.log("search component params",params)
  Object.entries(set).forEach(([key, value]) => {
    if (value) params.set(key, value);
    else params.delete(key);
  });
  // search changed → go back to the first page
  params.delete("page");
  return `${pathname}?${params.toString()}`;
};

console.log("new url",buildJobsUrl)


export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  console.log("search component searchParams",searchParams)
  console.log("search component pathname",pathname)
  console.log("search component router",router)

  // Local input state; initialized from the URL so refresh keeps the term
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  // Keep the input in sync when the URL changes (browser back/forward)
  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // STEP: write the search term into ?search= → server page re-fetches
    router.push(
      buildJobsUrl(pathname, searchParams, { search: value.trim() }),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by job title, keywords..."
          className="pl-9"
          aria-label="Search jobs"
        />
      </div>
      <Button type="submit">Search Jobs</Button>
    </form>
  );
}
