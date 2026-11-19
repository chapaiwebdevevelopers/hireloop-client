import SeekerApplication from '@/app/components/seeker/SeekerApplication';
import { getApplication } from '@/lib/actions/job';
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const JobSeekerApplicationPage = async() => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    console.log(session)
   
    const applications= await getApplication(`id=${session?.user.id}`)
    console.log("app",applications)
    return (
        <div>
            <SeekerApplication applications={applications} user={session?.user}></SeekerApplication>
        </div>
    );
};

export default JobSeekerApplicationPage;