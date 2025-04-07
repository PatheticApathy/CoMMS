import { TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { JobSite } from "@/user-api-types";

export default function Dashboard({ jobsite }: { header: string, jobsite: JobSite | undefined, route: string | undefined }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 px-4 lg:px-6 w-full">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Jobsite Name</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {jobsite?.name || "No Jobsite Available"}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Address: {jobsite?.addr?.Valid ? jobsite.addr.String : "No Address Available"}
          </div>
          <div className="text-muted-foreground">
            {jobsite?.location_lat && jobsite?.location_lng
              ? `Coordinates: (${jobsite.location_lat}, ${jobsite.location_lng})`
              : "No Coordinates Available"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
