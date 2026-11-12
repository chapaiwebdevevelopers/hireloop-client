"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteJob } from "@/lib/actions/job"
import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { dangerIconButtonClass } from "@/lib/styles"
import type { TJobListing } from "@/types/types"


export function DeleteJobsDialog({ job }: { job: TJobListing }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  // console.log("dialogJob",job)
  const handleDelete = async () => {
    const res = await deleteJob(job._id)
    console.log("try delete", job, res)
    if (res.deletedCount) {
      setOpen(false)
      toast.add({
        title: "Job deleted",
        description: "The Job is Permanant Deleted",
      })
      router.refresh()
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete job post"
            className={dangerIconButtonClass}
          >
            <Trash2 />{" "}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle> Delete {job.title} ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
