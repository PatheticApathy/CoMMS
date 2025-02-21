
import { useState } from 'react'
import JobsitePaths from "@/components/jobsite-paths";
import JobsiteMapWrapper from "@/components/jobsite-map-wrapper";
import useSWR from 'swr'
import { Jobsite } from '@/material-api-types';
import Loading from '@/components/loading';

const fetcher = async (url:string): Promise<Jobsite[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function JobSitePage() {

  const { data: sites, error, isLoading } = useSWR<Jobsite[],string>('/api/material/sites/all', fetcher)

  if (isLoading) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }

  return (
    <div className="dark:bg-gray-800 flex flex-col justify-center items-center h-screen w-screen">
      <h1 className="font-bold font-sans text-5xl basis-1/4">Jobsite Info</h1>
      <div><JobsitePaths /></div>
      <div className="w-full h-[500px]">
        <JobsiteMapWrapper jobsite={sites![0]}/>
      </div>
    </div>
  );
}
