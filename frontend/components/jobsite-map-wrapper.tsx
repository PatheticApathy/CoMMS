// src/components/JobsiteMapWrapper.tsx (Client Wrapper)
"use client";

import dynamic from "next/dynamic";
import { JobSite } from '@/user-api-types';

// Dynamically import JobsiteMap with ssr disabled
const JobsiteMap = dynamic(() => import("@/components/jobsite-map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function JobsiteMapWrapper() {
  return <JobsiteMap/>;
}
