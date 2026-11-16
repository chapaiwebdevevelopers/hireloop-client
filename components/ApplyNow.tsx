'use client'
import React from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { TJobData } from '@/types/types';
import { toast, Toaster } from "@/components/ui/toast"
import { ApplyToJob } from '@/lib/actions/job';

const ApplyNowButton = ({job}:{job:TJobData}) => {

   
    const {data:session}= useSession()
    const user = session?.user
    const router = useRouter()
      const handleApplyNow=async()=>{
        if(!user){
            router.push(`/sign-in/?redirectTo=/jobs/${job._id}`)
            return
        }else if (user.role ==="seeker"){
            // collecting data from userfrontend
            const application = {
                jobId:job._id,
                userId:user.id,
                email:user.email,
                jobTitle:job.title,
                companyName:job.companyName
            }
            // send data to database through 'ApplyToJob()' function 
            const sendJobData = await ApplyToJob(application)
            if(sendJobData.insertedId){
                 toast.add({
                 title: `You Applied for ${application.jobTitle}`,
                description: `Please keep Eye on Your Applied Job from Your profile`,
            })
            }
        }
        else{
           
            toast.add({
                type:'warning',
                 title: 'Are You jobSeeker ?',
                description: "Only JobSeeker Can Apply the Job",
            })
        }
  }

    return (
            <Button className="w-full" size="lg" onClick={handleApplyNow}>
              Apply Now
            </Button>
    );
};

export default ApplyNowButton;