import React from 'react';

const JobDetailsPage = async({params}: {params: Promise<{ Id: string }>
}) => {
    const { Id } = await params
    return (
        <div>
            <h2>Here will show job {Id} in details dynamically</h2>
        </div>
    );
};

export default JobDetailsPage;
