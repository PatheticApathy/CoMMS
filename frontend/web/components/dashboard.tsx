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
import { Material } from "@/material-api-types";

export default function Dashboard({jobsite, jobsites, materials, }: { jobsite: JobSite | undefined; jobsites: JobSite[] | undefined; materials: Material[] | undefined;}) {
  
  const filteredJobsites = jobsites?.filter((site) => site.id !== jobsite?.id);

  const getMostRecentMaterial = (jobsiteId: number | undefined) => {
    if (!materials || !jobsiteId) return null;
    const jobsiteMaterials = materials.filter((material) => material.job_site === jobsiteId);
    return jobsiteMaterials.sort(
      (a, b) => new Date(b.last_checked_out.Time).getTime() - new Date(a.last_checked_out.Time).getTime())[0];
  };

  const mainJobsiteMaterial = getMostRecentMaterial(jobsite?.id);

  return (
    <div className="flex flex-col gap-8 w-full px-4 lg:px-6">
      <h2 className="text-xl font-semibold mb-4">Your Job Site</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        <Card className="@container/card">
          <CardHeader className="relative">
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
              {mainJobsiteMaterial
                ? `Most Recent Material: ${mainJobsiteMaterial.name.String} (${mainJobsiteMaterial.quantity})`
                : "No Materials Available"}
            </div>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Other Jobsites</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {filteredJobsites && filteredJobsites.length > 0 ? (
            filteredJobsites.map((site) => {
              const recentMaterial = getMostRecentMaterial(site.id);
              return (
                <Card key={site.id} className="@container/card">
                  <CardHeader className="relative">
                    <CardDescription>Jobsite Name</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                      {site.name || "No Name Available"}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      Address: {site.addr?.Valid ? site.addr.String : "No Address Available"}
                    </div>
                    <div className="text-muted-foreground">
                      {recentMaterial
                        ? `Most Recent Material: ${recentMaterial.name.String} (${recentMaterial.quantity})`
                        : "No Materials Available"}
                    </div>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <p className="text-muted-foreground">No other jobsites available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
