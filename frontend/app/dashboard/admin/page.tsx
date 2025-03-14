'use client'

import { useState } from 'react';
import { UserTable } from '@/components/admin-table';
import { MaterialTable } from '@/components/admin-material';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const [showFirstTable, setShowFirstTable] = useState(true);

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
