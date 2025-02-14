'use client'
import { useState } from 'react'
import MTable from "@/components/material-table";
import { Material } from '@/material-api-types';
import MaterialFilter, { Filter } from '@/components/materials-filter';
import useSWR, { Fetcher } from 'swr'
import Loading from '@/components/loading';

const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args).then(res => res.json())
export default function DashboardPage() {

  const options: Filter = {
    id: "",
    quantity: "",
    status: "",
    type: "",
    jobsite: "",
  };

  const { data: materials, error, isLoading } = useSWR('/api/material/material/all', fetcher)
  const [filter, setFilter] = useState<Filter>(options);


  // Filter materials whenever filter changes
  const filterer = (materials: Material[] | undefined) => {
    if (materials) {
      if (filter.id) {
        return materials.filter(
          (material) => material.id === Number(filter.id)
        );
      }

      if (filter.quantity) {
        return materials.filter(
          (material) => material.quantity === Number(filter.quantity)
        );
      }

      if (filter.status) {
        return materials.filter(
          (material) => material.status.toLowerCase().includes(filter.status.toLowerCase())
        );
      }

      if (filter.type) {
        return materials.filter(
          (material) => material.type.String.toLowerCase().includes(filter.type.toLowerCase())
        );
      }
      if (filter.jobsite) {
        return materials.filter(
          (material) => material.job_site.Int64 == Number(filter.jobsite)
        );
      }

      else {
        return materials
      }

    }
  }

  const filtered = filterer(materials);

  if (isLoading) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }
  if (!filtered) {
    return (<div className='flex items-center justify-center w-screen h-screen'>No Data to display</div>)
  }
  return (
    <div className="flex">
      <MaterialFilter filter={filter} setFilterAction={setFilter} />
      <div className='flex justify-end h-screen w-screen'>
        <MTable materials={filtered} />
      </div>
    </div>
  );
}
