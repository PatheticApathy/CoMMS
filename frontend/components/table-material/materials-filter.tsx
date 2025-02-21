'use client'

import { ChangeEvent, Dispatch } from "react";
import { Input } from "@/components/ui/input";

export interface Filter {
  id: string,
  quantity: string,
  status: string,
  type: string
  jobsite: string
}


export default function MaterialFilter({ filter, setFilterAction }: { filter: Filter, setFilterAction: Dispatch<Filter> }) {

  const filterID = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterAction({ ...filter, id: e.target.value });
  };

  const filterQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterAction({ ...filter, quantity: e.target.value });
  };

  const filterStatus = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterAction({ ...filter, status: e.target.value });
  };

  const filterType = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterAction({ ...filter, type: e.target.value });
  };


  const filterJobSite = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterAction({ ...filter, jobsite: e.target.value });
  };

  return (
    <div className='flex flex-col  gap-5'>
      <Input type='text' value={filter.id} placeholder="ID" onChange={filterID} />
      <Input type='text' value={filter.quantity} placeholder="Quantity" onChange={filterQuantity} />
      <Input type='text' value={filter.status} placeholder="Status" onChange={filterStatus} />
      <Input type='text' value={filter.type} placeholder="Type" onChange={filterType} />
      <Input type='text' value={filter.jobsite} placeholder="Job Site" onChange={filterJobSite} />
    </div>
  )
}
