'use client'
import { Material } from '@/material-api-types';
import useSWR, { Fetcher } from 'swr'
import Loading from '@/components/loading';
import FilterAndTable from '@/components/table-material/material-filter+table';
import InitAddFormDialouge from "@/components/add-material-form/material-add-form-button";
import { getToken, IdentityContext } from '@/components/identity-provider';
import { User } from '@/user-api-types';
import { useContext } from 'react';


const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() } }).then(res => res.json())
const fetchUser: Fetcher<User, string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() } }).then(res => res.json())


//TODO: Prevent checkout of materials if no more materials
//BUG: Chceking out materials results in a 404, but materials are still taken out of the supply(two bugs)
export default function AllMaterialPage() {

  const identity = useContext(IdentityContext);
  const { data: user } = useSWR(identity ? `/api/user/search?id=${identity.id}` : null, fetchUser,)
  const { data: materials, error, isLoading } = useSWR(user ? `/api/material/material/search?site=${user.jobsite_id.Valid ? user.jobsite_id.Int64 : undefined}` : null, fetcher)

  if (isLoading || !identity) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured while trying to load materials</p>) }
  return (
    <div>
      <FilterAndTable route={user ? `/api/material/material/search?site=${user.jobsite_id.Valid ? user.jobsite_id.Int64 : undefined}` : undefined} header="Materials" materials={materials} />
      <InitAddFormDialouge route={user ? `/api/material/material/search?site=${user.jobsite_id.Valid ? user.jobsite_id.Int64 : undefined}` : undefined} materials={materials} />
    </div>
  );
}
