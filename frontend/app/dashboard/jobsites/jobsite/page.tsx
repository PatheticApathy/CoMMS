'use client'
import JobsitePaths from "@/components/jobsite-paths";
import JobsiteMapWrapper from "@/components/jobsite-map-wrapper";
import { Fetcher } from "swr";
import { Jobsite } from '@/material-api-types';
import Loading from "@/components/loading";
import useSWR from "swr";

const fetcher: Fetcher<Jobsite[], string> = async (...args) => fetch(...args).then(res => res.json())

export default function JobSitePage() {

  const site = {
    "id": 1,
    "name": "Louisiana Tech IESB",
    "addr": {
      "String": "Ruston, LA 71270",
      "Valid": true
    },
    "location_lat": {
      "Float64": 32.52634905,
      "Valid": true
    },
    "location_lng": {
      "Float64": -92.64349648220903,
      "Valid": true
    }
  }

  const { data: sites, error, isLoading } = useSWR('/api/sites/all', fetcher)

  if (isLoading) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }

  return (
    <div className="dark:bg-gray-800 flex flex-col justify-center items-center h-screen w-screen">
      <h1 className="font-bold font-sans text-5xl basis-1/4">Jobsite Info</h1>
      <div><JobsitePaths /></div>
      {(() => {
        if (sites) {
          return <div className="w-full h-[500px]"><JobsiteMapWrapper jobsite={sites[0]} /></div>
        } else {
          return <div>You Suck</div>
        }
      })()
      }
    </div>
  );
}
