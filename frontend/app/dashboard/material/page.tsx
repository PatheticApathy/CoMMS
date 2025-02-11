'use client'
import { useState } from 'react'
import MTable, { GetAllMaterials } from "@/components/material-table";
import { Material } from '@/material-api-types';
import MaterialFilter, { Filter, FilterFunction } from '@/components/materials-filter';
import useSWR, { Fetcher } from 'swr'
export default function DashboardPage() {

  const options: Filter = {
    id: "",
    quantity: "",
    status: "",
    type: ""
  };

  const fetcher: Fetcher<Material[], string> = (...args) => fetch(...args).then(res => res.json())
  const { data, error, isLoading } = useSWR('/api/material/material/all', fetcher)
  const [materials, setMaterial] = useState<Material[] | undefined>(data);

  const filterID = () => {
    const rows = materials?.map((material) => {
      if (material.id === Number(options.id)) {
        return material
      }
    })
    console.log(rows);
  };

  const filterQuantity = () => {
    const rows = materials?.map((material) => {
      if (material.quantity === Number(options.quantity)) {
        return material
      }
    });
    console.log(rows);
  };

  const filterStatus = () => {
    const rows = materials?.map((material) => {
      if (material.status === options.status) {
        return material
      }
    });
    console.log(rows);
  };

  const filterType = () => {
    const rows = materials?.map((material) => {
      if (material.type.Valid) {
        if (material.type.String === options.type) {
          return material
        }
      }
    });
    console.log(rows);
  };

  return (
    <div>
      <MaterialFilter filter1Action={filterID} filter2Action={filterQuantity} filter3Action={filterStatus} filter4Action={filterType} />
      <div className="flex flex-col justify-items-center items-center">
        <MTable data={materials} />
      </div>
    </div>
  );
}
