'use client'

import { useState } from 'react';
import { UserTable } from '@/components/admin-table';
import { MaterialTable } from '@/components/admin-material';
import { Button } from '@/components/ui/button';
import useSWR from 'swr'
import { Token } from '@/user-api-types';
import { getToken } from '@/components/identity-provider';

async function getProfileArgs(url: string, arg: string) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: arg
  }).then(res => res.json() as Promise<Token>)
}

const token = getToken()

export default function AdminPage() {
  const [showFirstTable, setShowFirstTable] = useState(true);
  const { data: tokenData, error: error2 } = useSWR([token ? '/api/user/decrypt' : null, token], ([url, token]) => url ? getProfileArgs(url, token) : null)


  if (!token) { return (<p className='flex items-center justify-center w-screen h-screen'>Invalid Token</p>) }


  if (error2) { return (<p className='flex items-center justify-center w-screen h-screen'>{error2.message}</p>) }

  console.log(tokenData)
  if (tokenData?.role.Valid && tokenData?.role.String === 'admin') {
    return (
      <div className="flex flex-col justify-center items-center w-screen">
        <h1 className="font-bold text-5xl mb-4">Admin</h1>
        <Button onClick={() => setShowFirstTable(!showFirstTable)} className="mb-4">
          Switch Table
        </Button>
        <div className="flex flex-col justify-self-end items-center">
          {showFirstTable ? <UserTable /> : <MaterialTable />}
        </div>
      </div>
    );
  }
  else { return (<p className='flex items-center justify-center w-screen h-screen'>Not and Admin</p>) }
}
