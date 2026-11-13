'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { JobForm } from '@/app/components/JobForm'
import { TJobListing } from '@/types/types'
import { toJobData } from '@/lib/job-utils'

/**
 * "Update" action for a job row — opens the reusable JobForm in a
 * shadcn dialog popup, prefilled with the job's current data.
 */
export  function  UpdateJobDialog({ job }: { job: TJobListing }) {
  const [open, setOpen] = useState(false)
 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Update
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Update Job Post</DialogTitle>
          <DialogDescription>
            {job.title} · {job.companyName}
          </DialogDescription>
        </DialogHeader>
        <JobForm
          jobId={job._id}
          initialData={toJobData(job)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
