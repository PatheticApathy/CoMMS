// src/components/JobsiteMapWrapper.tsx (Client Wrapper)
"use client";

import dynamic from "next/dynamic";
import { Jobsite } from '@/material-api-types';

// Dynamically import JobsiteMap with ssr disabled
const JobsiteMap = dynamic(() => import("@/components/jobsite-map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function JobsiteMapWrapper({ jobsite }: { jobsite: Jobsite }) {
  return <JobsiteMap jobsite={jobsite} />;
}
