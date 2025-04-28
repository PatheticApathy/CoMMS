import AddMaterialFormDialouge from "./material-add-dialog";
import { Button } from "../ui/button";
import { Material } from "@/material-api-types";
export default function InitAddFormDialouge({ materials, route }: { materials: Material[] | undefined, route: string | undefined }) {
  return (
    <AddMaterialFormDialouge route={route} materials={materials}>
      <Button className="fixed bottom-4 right-4 rounded-sm text-2xl" variant={"accent"}>+</Button>
    </AddMaterialFormDialouge>
  )
}

