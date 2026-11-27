"use client"

import React, { useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { TApplyJob, TJobData } from "@/types/types"
import { toast } from "@/components/ui/toast"
// import { ApplyToJob, checkUserApplied } from "@/lib/actions/job"
// import { CountAppliedJob } from "@/lib/api/jobs"
// import { getPremiumUserById } from "@/lib/api/premiumUsers"
import { ApplyToJob, checkUserApplied, getApplyEligibility } from "@/lib/actions/job"


interface ApplyNowButtonProps {
  job: TJobData
  initialApplied?: boolean
}

const ApplyNowButton = ({ job, initialApplied = false }: ApplyNowButtonProps) => {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()

  const [hasApplied, setHasApplied] = useState<boolean>(initialApplied)
  const [isChecking, setIsChecking] = useState<boolean>(!initialApplied)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Verify whether the current logged-in user has already applied for this job
  useEffect(() => {
    let isMounted = true

    if (initialApplied) {
      setHasApplied(true)
      setIsChecking(false)
      return
    }

    if (!user?.id || !job?._id) {
      setIsChecking(false)
      return
    }

    const verifyApplicationStatus = async () => {
      try {
        const applied = await checkUserApplied(user.id, job._id!)
        if (isMounted) {
          setHasApplied(applied)
        }
      } catch (error) {
        console.error("Failed to verify user application status:", error)
      } finally {
        if (isMounted) {
          setIsChecking(false)
        }
      }
    }

    verifyApplicationStatus()

    return () => {
      isMounted = false
    }
  }, [user?.id, job?._id, initialApplied])

  const handleApplyNow = async () => {
    if (hasApplied) return

    if (!user) {
      router.push(`/sign-in/?redirectTo=/jobs/${job._id}`)
      return
    }

    if (user.role !== "seeker") {
      toast.add({
        type: "warning",
        title: "Are you a Job Seeker?",
        description: "Only candidates registered as Job Seekers can apply for jobs.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // const premiumUserInfo = await getPremiumUserById(user.id)

      // // Check number of jobs already applied for by this user
      // const CountJobByUser = await CountAppliedJob(`id=${user.id}`)

      // // Non-premium seekers with 10+ applications must upgrade
      // if (!premiumUserInfo?.premium && CountJobByUser?.count >= 10) {
      //   router.push("/payment")
      //   return
      // }

const { limitReached } = await getApplyEligibility()
 if (limitReached) {
         router.push("/payment")
         return
       }


      // Construct application payload
      const application: TApplyJob = {
        jobId: job._id || "",
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

      // Submit application to backend
      const sendJobData = await ApplyToJob(application)

      if (sendJobData?.insertedId) {
        setHasApplied(true)
        toast.add({
          title: `You applied for ${application.title}!`,
          description: "Keep an eye on your application progress from your seeker dashboard.",
        })
        router.refresh()
      } else {
        toast.add({
          type: "error",
          title: "Submission Issue",
          description: sendJobData?.message || "Could not complete application. Please try again.",
        })
      }
    } catch (error) {
      console.error("ApplyToJob error:", error)
      toast.add({
        type: "error",
        title: "Application Error",
        description: "An unexpected error occurred while applying. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 1. User has already applied: render disabled button with "Applied"
  if (hasApplied) {
    return (
      <Button
        className="w-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-not-allowed hover:bg-emerald-500/10 font-semibold"
        size="lg"
        disabled
      >
        <Check className="size-4 mr-2" />
        Applied
      </Button>
    )
  }

  // 2. Default Apply Now button (handles loading and submit states)
  return (
    <Button
      className="w-full font-semibold"
      size="lg"
      onClick={handleApplyNow}
      disabled={isChecking || isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="size-4 mr-2 animate-spin" />
          Applying...
        </>
      ) : isChecking ? (
        <>
          <Loader2 className="size-4 mr-2 animate-spin" />
          Checking status...
        </>
      ) : (
        "Apply Now"
      )}
    </Button>
  )
}

export default ApplyNowButton
