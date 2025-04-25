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
import { MaterialWithLogs } from "@/material-api-types";
import Link from "next/link";

export default function Dashboard({jobsite, jobsites, materials, }: { jobsite: JobSite | undefined; jobsites: JobSite[] | undefined; materials: MaterialWithLogs[] | undefined;}) {
  
  const filteredJobsites = jobsites?.filter((site) => site.id !== jobsite?.id);

  const getMostRecentMaterial = (jobsiteId: number | undefined) => {
    if (!materials || !jobsiteId) return null;
    const jobsiteMaterials = materials.filter((material) => material.job_site === jobsiteId);
    return jobsiteMaterials.sort(
      (a, b) => new Date(b.timestamp.Time).getTime() - new Date(a.timestamp.Time).getTime()).reverse()[0];
  };

  const mainJobsiteMaterial = getMostRecentMaterial(jobsite?.id);

  return (
    <div className="flex flex-col gap-8 w-3/5 px-4 lg:px-6">
      <h2 className="text-xl font-semibold mb-4">Your Job Site</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        <Link href="dashboard/jobsite">
          <Card className="@container/card cursor-pointer bg-accent text-surface border border-secondary hover:shadow-lg transition-shadow">
            <CardHeader className="bg-accent text-primary rounded-t-xl">
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-surface">
                {jobsite?.name || "No Jobsite Available"}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm text-surface bg-accent rounded-b-xl">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Address: {jobsite?.addr?.Valid ? jobsite.addr.String : "No Address Available"}
              </div>
              <div className="text-surface/70">
                {mainJobsiteMaterial ? `Most Recent Material: ${mainJobsiteMaterial.name.String} (${mainJobsiteMaterial.quantity})` : "No Materials Available"}
              </div>
            </CardFooter>
          </Card>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Other Jobsites</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
          {filteredJobsites && filteredJobsites.length > 0 ? (
            filteredJobsites.map((site) => {
              const recentMaterial = getMostRecentMaterial(site.id);
              return (
                <Card className="@container/card cursor-pointer bg-accent text-surface border border-secondary hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-accent text-primary rounded-t-xl">
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-surface">
                      {site.name || "No Name Available"}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1 text-sm text-surface bg-accent rounded-b-xl">
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
