'use client';

import Dashboard from '@/components/dashboard';
import Loading from '@/components/loading';
import useSWR, { Fetcher } from 'swr';
import { getToken, IdentityContext } from '@/components/identity-provider';
import { JobSite, GetUserRow } from '@/user-api-types';
import { MaterialWithLogs } from '@/material-api-types';
import { useContext } from 'react';

const fetchUser: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, { headers: { Authorization: getToken() } }).then((res) => res.json());
const fetchJobsite: Fetcher<JobSite, string> = async (...args) => fetch(...args, { headers: { Authorization: getToken() } }).then((res) => res.json());
const fetchJobsites: Fetcher<JobSite[], string> = async (...args) => fetch(...args, { headers: { Authorization: getToken() } }).then((res) => res.json());
const fetchMaterials: Fetcher<MaterialWithLogs[], string> = async (...args) => fetch(...args, { headers: { Authorization: getToken() } }).then((res) => res.json());

export default function DashBoardPage() {

  const identity = useContext(IdentityContext);
  const { data: user } = useSWR(identity ? `/api/user/search?id=${identity.id}` : null, fetchUser);
  const { data: jobsite } = useSWR(user && user[0] ? `/api/sites/search?id=${user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : undefined}` : null, fetchJobsite);
  const { data: jobsites } = useSWR(user && user[0] ? `/api/sites/company?id=${user[0].company_id.Valid ? user[0].company_id.Int64 : undefined}` : null, fetchJobsites);
  const { data: materials } = useSWR(user && user[0] ? `/api/material/material/created` : null, fetchMaterials);

  if (!identity ) {
    return (<div className="flex items-center justify-center w-screen h-screen">Loading <Loading /></div>);}

  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <Dashboard jobsite={jobsite} jobsites={jobsites} materials={materials} />
    </div>
  );
}