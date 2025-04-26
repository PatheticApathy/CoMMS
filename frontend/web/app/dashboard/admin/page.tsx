'use client'

import { useState } from 'react';
import { UserTable } from '@/components/admin-table';;
import { Button } from '@/components/ui/button';
import useSWR, { Fetcher } from 'swr';
import { GetUserRow } from '@/user-api-types';
import { getToken, IdentityContext } from '@/components/identity-provider';
import { useContext } from 'react';
import FilterAndTable from '@/components/table-material/material-filter+table';
import { Material } from '@/material-api-types';


const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() } }).then(res => res.json())

const fetchUser: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, { headers: { Authorization: getToken() } }).then((res) => res.json());



export default function AdminPage() {
  
  const [showFirstTable, setShowFirstTable] = useState(true);
  
  const identity = useContext(IdentityContext);
  const { data: user } = useSWR(identity ? `/api/user/search?id=${identity.id}` : null, fetchUser);
  const { data: materials, error, isLoading } = useSWR(user && user[0] ? `/api/material/material/search?site=${user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : undefined}` : null, fetcher)


  if (!identity) { return (<p className='flex items-center justify-center w-screen h-screen'>Invalid Token</p>) }

  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>{error.message}</p>) }

  if (user && user[0]?.role.Valid && user[0]?.role.String === 'admin') {
    return (
      <div className="flex flex-col justify-center items-center w-screen">
        <h1 className="font-bold text-5xl mb-4">Admin</h1>
        <Button variant="yellow" onClick={() => setShowFirstTable(!showFirstTable)} className="mb-4">
          Switch Table
        </Button>
        <div className="flex flex-col justify-self-end items-center">
        {showFirstTable ? <UserTable /> : <FilterAndTable route={user && user[0] ? `/api/material/material/search?site=${user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : undefined}` : undefined} header="" materials={materials} />}
        </div>
      </div>
    );
  }
  else { return (<p className='flex items-center justify-center w-screen h-screen'>Not an Admin</p>) }
}
