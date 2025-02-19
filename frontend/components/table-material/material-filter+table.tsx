'use client'
import { Dispatch } from 'react'
import MTable from "./material-table";
import { Material } from '@/material-api-types';
import MaterialFilter, { Filter } from '@/components/table-material/materials-filter';

//component uses whole screen. Considered a page component
export default function FilterAndTable({ filter, setFilterAction, materials }: { filter: Filter, setFilterAction: Dispatch<Filter>, materials: Material[] | undefined }) {

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

  if (!filtered) {
    return (<div className='flex items-center justify-center w-screen h-screen'>No Data to display</div>)
  }
  return (
    <div className="flex">
      <MaterialFilter filter={filter} setFilterAction={setFilterAction} />
      <div className='flex justify-end h-screen w-screen'>
        <MTable materials={filtered} />
      </div>
    </div>
  );
}
