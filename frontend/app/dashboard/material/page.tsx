'use client'
import { ChangeEvent, useEffect, useState } from 'react'
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
  const [filter, setFilter] = useState<Filter>(options);
  const [materials, setMaterial] = useState<Material[] | undefined>(undefined);

  const filterID = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, id: e.target.value });
  };

  const filterQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, quantity: e.target.value });
  };

  const filterStatus = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, status: e.target.value });
  };

  const filterType = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, type: e.target.value });
  };


  //whenerver data is done
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
          (material) => filter.status.includes(material.status)
        );
      }

      if (filter.type) {
        filteredMaterials = filteredMaterials.filter(
          (material) => filter.type.includes(material.type.String)
        );
      }

      setMaterial(filteredMaterials);
    }
  }, [filter, data]);

  if (isLoading) { <div>...Loading</div> }
  if (error) { <div>Error occured</div> }
  return (
    <div>
      <MaterialFilter filter={filter} filter1Action={filterID} filter2Action={filterQuantity} filter3Action={filterStatus} filter4Action={filterType} />
      <div className="flex flex-col justify-items-center items-center">
        <MTable data={materials} />
      </div>
    </div>
  );
}
