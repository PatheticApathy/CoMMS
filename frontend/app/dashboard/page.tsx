import MTable from "@/components/material-table";
import { GetMaterials } from "@/server_side/get_material";
export default async function DashboardPage() {

  return (
    <div className="flex flex-col justify-self-end items-center">
      <MTable />
    </div>
  );
}
