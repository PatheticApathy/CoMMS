'use client'
import MTable from "./material-table";
import { Material } from '@/material-api-types';

//component uses whole screen. Considered a page component
export default function FilterAndTable({ header, materials, route }: { header: string, materials: Material[] | undefined, route: string | undefined }) {
  return (
    <div className='h-screen'>
      <h1 className='text-center font-bold  text-7xl'>{header}</h1>
      <div className="flex w-screen ">
        {materials ?
          <MTable materials={materials} route={route} />
          :
          <>No data to dispay at this time</>
        }
      </div>
    </div>
  );
}
