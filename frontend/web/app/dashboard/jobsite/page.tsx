import JobsitePaths from "@/components/jobsite-paths";
import JobsiteMapWrapper from "@/components/jobsite-map-wrapper";

export default function JobSitePage() {

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <h1 className="font-bold font-sans text-5xl basis-1/4">Jobsite Info</h1>
      <div><JobsitePaths /></div>
      <div className="w-full h-[500px]"><JobsiteMapWrapper/></div>
    </div>
  );
}
