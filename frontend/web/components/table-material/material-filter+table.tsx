'use client'
import MTable from "./material-table";
import { Material } from '@/material-api-types';

//component uses whole screen. Considered a page component
export default function FilterAndTable({ header, materials, route }: { header: string, materials: Material[] | undefined, route: string | undefined }) {
  return (
    <div className='flex flex-col justify-center items-center h-full w-full'>
      <div className="ml-24 mr-16 mt-10 mb-10">
        {header == "" ?  null: <h1 className='text-center font-bold  text-7xl'>{header}</h1>}
          <div className="w-full ">
            {materials ?
              <MTable materials={materials} route={route} />
              :
              <>No data to dispay at this time</>
          }
        </div>
      </div>
    </div>
  );
}
