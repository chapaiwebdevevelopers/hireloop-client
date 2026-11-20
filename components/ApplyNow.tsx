"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { redirect, useRouter } from "next/navigation"
import { TApplyJob, TJobData } from "@/types/types"
import { toast } from "@/components/ui/toast"
import { ApplyToJob } from "@/lib/actions/job"
import { CountAppliedJob } from "@/lib/api/jobs"

const ApplyNowButton = ({ job }: { job: TJobData }) => {
  const { data: session } = useSession()
  const user = session?.user
  console.log("user", user)
  const router = useRouter()
  const handleApplyNow = async () => {
    if (!user) {
      router.push(`/sign-in/?redirectTo=/jobs/${job._id}`)
      return
    } else if (user.role === "seeker") {
      // check number of Applied by this user
      const CountJobByUser = await CountAppliedJob(`id=${user?.id}`)
      console.log("CountJobByUser:",CountJobByUser)
      //less more than 10 and not premium user
      if (CountJobByUser.count >= 10) {
        // redirect to payment page
        router.push("/payment")
        return
      } else {
        // collecting data from userfrontend
        const application: TApplyJob = {
          jobId: job._id,
          userId: user.id,
          email: user.email,
          title: job.title,
          company: job.companyName,
          jobType: job.jobType,
          workMode: job.workMode,
          status: "Applied",
          Deadline: job.deadline,
          archived: false,
          appliedAt: new Date().toISOString(),
        }
        // send data to database through 'ApplyToJob()' function
        const sendJobData = await ApplyToJob(application)
        if (sendJobData.insertedId) {
          toast.add({
            title: `You Applied for ${application.title}`,
            description: `Please keep Eye on Your Applied Job from Your profile`,
          })
        }
      }
    } else {
      toast.add({
        type: "warning",
        title: "Are You jobSeeker ?",
        description: "Only JobSeeker Can Apply the Job",
      })
    }
  }

  return (
    <Button className="w-full" size="lg" onClick={handleApplyNow}>
      Apply Now
    </Button>
  )
}

export default ApplyNowButton
