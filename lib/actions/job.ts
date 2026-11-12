import { TJobData } from "@/types/types"

const BASE_URL=process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const createJob = async(data:TJobData)=>{
    const res = await fetch(`${BASE_URL}/jobs`,{
        method:"POST",
        headers:{
            'Content-type':'application/json',
        },
        body:JSON.stringify(data)
    })
     const result = await res.json()

  return result
}
export const deleteJob= async(jobId:string)=>{
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`,{
        method:'DELETE'
    })
    return res.json()
}