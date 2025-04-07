'use client'

import Dashboard from '@/components/dashboard';
import Loading from '@/components/loading';
import useSWR, { Fetcher } from 'swr'
import { getToken, IdentityContext } from '@/components/identity-provider';
import { User, JobSite } from '@/user-api-types';
import { useContext } from 'react';

const fetchUser: Fetcher<User, string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() } }).then(res => res.json())
const fetchJobsite: Fetcher<JobSite, string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() } }).then(res => res.json())


export default function DashBoardPage() {

  const identity = useContext(IdentityContext);
  const { data: user } = useSWR(identity ? `/api/user/search?id=${identity.id}` : null, fetchUser,)
  const { data: jobsite } = useSWR(user ? `/api/sites/search?id=${user.jobsite_id.Valid ? user.jobsite_id.Int64 : undefined}` : null, fetchJobsite,)

  if (!identity) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }

  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <Dashboard route={user ? `/api/sites/search?id=${user.jobsite_id.Valid ? user.jobsite_id.Int64 : undefined}` : undefined} header="Jobsite" jobsite={jobsite} />
    </div>
  );
}
