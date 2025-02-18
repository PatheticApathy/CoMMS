'use client'
import { useState } from 'react'
import { Material } from '@/material-api-types';
import { User } from '@/user-api-types';
import { Filter } from '@/components/materials-filter';
import useSWR, { Fetcher } from 'swr'
import Loading from '@/components/loading';
import { DataTableDemo } from '@/components/admin-table';


export default function AdminPage() {

  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <h1 className="font-bold text-5xl mb-4">Admin</h1>
      <div className="flex flex-col justify-self-end items-center">
              <DataTableDemo />
        </div>
    </div>
  );
}
