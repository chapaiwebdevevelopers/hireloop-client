import { Suspense } from "react";
import { getJobs } from "@/lib/api/jobs";
import { TJobListing } from "@/types/types";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { SingleCard } from "@/components/SingleCard";
import { SearchBar } from "@/components/SearchBar";
import { SortBy } from "@/components/SortBy";
import { isSortValue } from "@/lib/job-utils";

/**
 * Jobs archive page — search, filter, sort and paginate all through the
 * URL query string, so every control is simple frontend logic.
 *
 * Filters: ?search= ?jobType= (multi) ?workMode= (multi)
 *          ?jobCategory= (multi) ?status= (multi) ?sort= ?page=
 *
 * STEP (later, backend): let the API honor these params so filtering
 * happens in the database. Until then the fetched jobs are filtered,
 * sorted and paged on the server side below — no backend code touched.
 */

const JOBS_PER_PAGE = 6;

/** Normalizes a searchParams entry into a string array */
const asArray = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];


const JobsArchivePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  console.log("searchParam:",searchParams)
  const search = await searchParams;
    console.log("Search:",search)
  // Existing pattern: forward the URL query to the API unchanged
  const urlSearch = new URLSearchParams();
  console.log("urlSearch",urlSearch)

 Object.entries(search).forEach(([key, value]) => {
    asArray(value).forEach((entry) => {
      if (entry) urlSearch.append(key, entry);
    });
  });
 
  const query = urlSearch.toString();
  console.log("queary",query)
  const searchInfo = await getJobs(query);
   console.log("searchInfo",searchInfo)

  // Counts source: an unfiltered fetch so every filter item always shows
  // its full count, even while a filter/sort/page is active (frontend-only)
  const countSource = query ? await getJobs() : searchInfo;

  // ---------- frontend-only logic (no backend changes) ----------

  const searchTerm = (asArray(search.search)[0] ?? "").toLowerCase();
  console.log("searchTerm",searchTerm)
  const sort = isSortValue(asArray(search.sort)[0]);
  console.log("sort",sort)
 
  const filteredJobs = searchInfo
    .filter((job) =>
      searchTerm
        ? `${job.title} ${job.companyName} ${job.jobCategory}`
            .toLowerCase()
            .includes(searchTerm)
        : true,
    )
    // multi-select filters — a job matches if any selected value fits
    .filter((job) => {
      const matches = (key: "jobType" | "workMode" | "jobCategory" | "status") =>
        asArray(search[key]).length
          ? asArray(search[key]).includes(job[key])
          : true;
      return (
        matches("jobType") &&
        matches("workMode") &&
        matches("jobCategory") &&
        matches("status")
      );
    });

  // Default ("Most Recent") keeps the API order; salary sorts are computed here
  const sortedJobs = [...filteredJobs];
  if (sort === "salary-desc") {
    sortedJobs.sort((a, b) => Number(b.maxSalary) - Number(a.maxSalary));
  } else if (sort === "salary-asc") {
    sortedJobs.sort((a, b) => Number(a.minSalary) - Number(b.minSalary));
  }

  const totalFound = sortedJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalFound / JOBS_PER_PAGE));
  const currentPage = Math.min(
    Math.max(Number(asArray(search.page)[0])  || 1, 1),
    totalPages,
  );
  console.log()
  const visibleJobs = sortedJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      {/* Page header + search toolbar */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Find Your Next Job</h2>
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filter sidebar — always visible, never collapsed or hidden;
            counts computed from the unfiltered list so they always show */}
        <Suspense
          fallback={
            <div className="h-96 animate-pulse rounded-xl border bg-card" />
          }
        >
          <FilterSidebar jobs={countSource} />
        </Suspense>

        {/* Results */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Found{" "}
              <span className="font-semibold text-foreground">
                {totalFound}
              </span>{" "}
              Professional Jobs
            </p>
            <Suspense fallback={null}>
              <SortBy />
            </Suspense>
          </div>

          {visibleJobs.length ? (
            <div className="space-y-4">
              {visibleJobs.map((job: TJobListing) => (
                <SingleCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No jobs match your search or filters — try adjusting them.
            </p>
          )}

          <Suspense fallback={null}>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default JobsArchivePage;
