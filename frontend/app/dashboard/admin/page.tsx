'use client'

import { useState } from 'react';
import { UserTable } from '@/components/admin-table';
import { MaterialTable } from '@/components/admin-material';
import { Button } from '@/components/ui/button';
import useSWR from 'swr'
import { getToken } from '@components/localStorage'

async function getProfileArgs(url: string, arg: {token: string}) {
  return fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token: arg})
  }).then(res => res.json())
}

export default function AdminPage() {
  const [showFirstTable, setShowFirstTable] = useState(true);

  let token = getToken()
  let id = 1

  const { data: tokenData, error: error2 } = useSWR(['api/user/decrypt', token], ([url, token]) => getProfileArgs(url, token))
  if (tokenData)
      id = tokenData.id

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
