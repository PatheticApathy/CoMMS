'use client'
import { Material } from '@/material-api-types';
import useSWR, { Fetcher } from 'swr'
import Loading from '@/components/loading';
import FilterAndTable from '@/components/table-material/material-filter+table';
import InitAddFormDialouge from "@/components/add-material-form/material-add-form-button";
import { getToken, useIdentity } from '@/hooks/useToken';
import { GetUserRow } from '@/user-api-types';


const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() } }).then(res => res.json())
const fetchUser: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() } }).then(res => res.json())


//TODO: Prevent checkout of materials if no more materials(should be implemnted need to test)
export default function AllMaterialPage() {


  const identity = useIdentity();
  const { data: user } = useSWR(identity ? `/api/user/search?id=${identity.id}` : null, fetchUser,)
  const { data: materials, error, isLoading } = useSWR(user && user[0] ? `/api/material/material/search?site=${user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : undefined}` : null, fetcher)

  if (isLoading || !identity) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured while trying to load materials</p>) }
  return (
    <div>
      <FilterAndTable route={user && user[0] ? `/api/material/material/search?site=${user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : undefined}` : undefined} header="Materials" materials={materials} />
      <InitAddFormDialouge route={user && user[0] ? `/api/material/material/search?site=${user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : undefined}` : undefined} materials={materials} />
    </div>
  );
}
