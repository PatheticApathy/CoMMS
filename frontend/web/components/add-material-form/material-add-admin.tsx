import AddMaterialFormDialouge from "./material-add-dialog";
import { Button } from "../ui/button";
export default function InitAddFormDialougeAdmin() {
  return (
    <AddMaterialFormDialouge>
      <Button className="" variant={"outline"}>+</Button>
    </AddMaterialFormDialouge>
  )
}