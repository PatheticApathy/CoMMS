'use client'
import { useState } from 'react'
import { Material } from '@/material-api-types';
import useSWR, { Fetcher } from 'swr'
import Loading from '@/components/loading';
import FilterAndTable from '@/components/table-material/material-filter+table';
import InitAddFormDialouge from "@/components/add-material-form/material-add-form-button";

const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args).then(res => res.json())
export default function AllMaterialPage() {

  const { data: materials, error, isLoading } = useSWR('/api/material/material/all', fetcher)


  if (isLoading) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }
  return (
    <div>
      <FilterAndTable header="Materials" materials={materials} />
      <InitAddFormDialouge />
    </div>
  );
}
