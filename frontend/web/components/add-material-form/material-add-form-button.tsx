import AddMaterialFormDialouge from "./material-add-dialog";
import { Button } from "../ui/button";
export default function InitAddFormDialouge() {
  return (
    <AddMaterialFormDialouge>
      <Button className="fixed bottom-4 right-4 rounded-sm text-2xl" variant={"outline"}>+</Button>
    </AddMaterialFormDialouge>
  )
}

