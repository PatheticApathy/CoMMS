
import JobsitesCore from "@/components/jobsites-core";

export default function JobSite() {
  return (
    <div className="dark:bg-gray-800 flex flex-col justify-center items-center h-screen w-screen">
      <h1 className="font-bold font-sans text-5xl basis-1/4">Your Jobsites</h1>
      <div><JobsitesCore /></div>
    </div>
  );
}