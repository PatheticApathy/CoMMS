'use client'
import { useState } from 'react'
import { Material } from '@/material-api-types';
import { Filter } from '@/components/table-material/materials-filter';
import useSWR, { Fetcher } from 'swr'
import Loading from '@/components/loading';
import FilterAndTable from '@/components/table-material/material-filter+table';
import { useParams } from 'next/navigation';

const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args).then(res => res.json())
export default function JobSiteMaterialPage() {

  const options: Filter = {
    id: "",
    quantity: "",
    status: "",
    type: "",
    jobsite: "",
  };

  const { id } = useParams()
  const { data: materials, error, isLoading } = useSWR(`/api/material/material/search?site=${id}`, fetcher)
  const [filter, setFilter] = useState<Filter>(options);


  if (isLoading) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }
  return (
    <FilterAndTable filter={filter} setFilterAction={setFilter} materials={materials} />
  );
}
