import { getJobs } from '@/lib/api/jobs';
import React from 'react';



const JobsArchivePage = async({searchParams,}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const search = await searchParams;
    const urlSearch = new URLSearchParams(search as Record<string,string>);
    const query = urlSearch.toString()
    const searchInfo = await getJobs(query)
    console.log({urlSearch,query,searchInfo})
    return (
        <div>
            <h2>Here Show All Jobs in Card Style</h2>
            {
                searchInfo.map(item=> <><h2>{item.title}</h2></>)
            }
        </div>
    );
};

export default JobsArchivePage;