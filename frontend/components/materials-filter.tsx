'use client'

import { ChangeEvent } from "react";
import { Input } from "./ui/input";

export interface Filter {
  id: string,
  quantity: string,
  status: string,
  type: string
}
export type FilterFunction = (event: ChangeEvent) => void;

export default function MaterialFilter({ filter1Action, filter2Action, filter3Action, filter4Action }: { filter1Action: FilterFunction, filter2Action: FilterFunction, filter3Action: FilterFunction, filter4Action: FilterFunction }) {
  return (
    <div className='flex flex-row'>
      <Input type='text' onChange={filter1Action} />
      <Input type='text' onChange={filter2Action} />
      <Input type='text' onChange={filter3Action} />
      <Input type='text' onChange={filter4Action} />
    </div>
  )
}
