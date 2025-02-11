'use client'

import { ChangeEvent } from "react";
import { Input } from "./ui/input";

export interface Filter {
  id: string,
  quantity: string,
  status: string,
  type: string
}
export type FilterFunction = (e: ChangeEvent<HTMLInputElement>) => void;

export default function MaterialFilter({ filter, filter1Action, filter2Action, filter3Action, filter4Action }: { filter: Filter, filter1Action: FilterFunction, filter2Action: FilterFunction, filter3Action: FilterFunction, filter4Action: FilterFunction }) {
  return (
    <div className='flex flex-row'>
      <Input type='text' value={filter.id} placeholder="ID" onChange={filter1Action} />
      <Input type='text' value={filter.quantity} placeholder="Quantity" onChange={filter2Action} />
      <Input type='text' value={filter.status} placeholder="Status" onChange={filter3Action} />
      <Input type='text' value={filter.type} placeholder="Type" onChange={filter4Action} />
    </div>
  )
}
