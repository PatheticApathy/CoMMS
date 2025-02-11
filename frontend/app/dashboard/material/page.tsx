'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import MTable from "@/components/material-table";
import { Material } from '@/material-api-types';
import MaterialFilter, { Filter } from '@/components/materials-filter';
import useSWR, { Fetcher } from 'swr'
import Loading from '@/components/loading';
export default function DashboardPage() {

  const options: Filter = {
    id: "",
    quantity: "",
    status: "",
    type: "",
    jobsite: "",
  };

  const fetcher: Fetcher<Material[], string> = (...args) => fetch(...args).then(res => res.json())
  const { data, error, isLoading } = useSWR('/api/material/material/all', fetcher)
  const [filter, setFilter] = useState<Filter>(options);
  const [materials, setMaterial] = useState<Material[] | undefined>(undefined);


  //whenerver data is grabbed
  useEffect(() => { setMaterial(data) }, [data])

  // Filter materials whenever filter changes
  useEffect(() => {
    if (data) {
      let filteredMaterials = data;

      if (filter.id) {
        filteredMaterials = filteredMaterials.filter(
          (material) => material.id === Number(filter.id)
        );
      }

      if (filter.quantity) {
        filteredMaterials = filteredMaterials.filter(
          (material) => material.quantity === Number(filter.quantity)
        );
      }

      if (filter.status) {
        filteredMaterials = filteredMaterials.filter(
          (material) => material.status.includes(filter.status)
        );
      }

      if (filter.type) {
        filteredMaterials = filteredMaterials.filter(
          (material) => material.type.String.includes(filter.type)
        );
      }
      if (filter.jobsite) {
        filteredMaterials = filteredMaterials.filter(
          (material) => material.job_site.Int64 == Number(filter.jobsite)
        );
      }

      setMaterial(filteredMaterials);
    }
  }, [filter, data]);

  if (isLoading) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured lol</p>) }
  return (
    <div className="flex">
      <MaterialFilter filter={filter} setFilterAction={setFilter} />
      <div className='flex justify-end h-screen w-screen'>
        <MTable data={materials} />
      </div>
    </div>
  );
}
