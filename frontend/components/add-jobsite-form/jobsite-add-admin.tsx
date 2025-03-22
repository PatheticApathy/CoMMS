import AddJobsiteFormDialouge from "./jobsite-add-dialog";
import { Button } from "../ui/button";
export default function InitAddFormDialougeAdmin() {
  return (
    <AddJobsiteFormDialouge>
      <Button className="" variant={"outline"}>+</Button>
    </AddJobsiteFormDialouge>
  )
}