import { JobForm } from '@/app/components/JobForm'
import { pageContainerClass } from '@/lib/styles'

const NewJobPage = () => {
  return (
    <div className={pageContainerClass}>
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-semibold">Create Job Post</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Modify position specifications, compensation range, and candidate requirements for this
          listing.
        </p>
      </div>

      <JobForm submitLabel="Publish Job" />
    </div>
  )
}

export default NewJobPage
