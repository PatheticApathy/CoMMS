'use client'
import { useState } from 'react'
import { Material } from '@/material-api-types';
import { Filter } from '@/components/materials-filter';
import useSWR, { Fetcher } from 'swr'
import Loading from '@/components/loading';
import FilterAndTable from '@/components/material-filter+table';

const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args).then(res => res.json())
export default function AllMaterialPage() {

  const options: Filter = {
    id: "",
    quantity: "",
    status: "",
    type: "",
    jobsite: "",
  };

  const { data: materials, error, isLoading } = useSWR('/api/material/material/all', fetcher)
  const [filter, setFilter] = useState<Filter>(options);


  if (isLoading) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }
  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <h1 className="font-bold text-5xl mb-4">Materials</h1>
      <div className='flex'>
        <MaterialFilter filter={filter} setFilterAction={setFilter} />
        <div className='flex justify-end h-screen w-screen'>
          <MTable data={materials} />
        </div>
      </div>
    </div>
  );
}
