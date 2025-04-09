import JobsiteMapWrapper from "@/components/jobsite-map-wrapper";

export default function JobSitePage() {

  return (
    <div className="flex flex-row justify-center items-center h-screen w-screen">
      <h1 className="font-bold font-sans text-5xl basis-1/4" style={{marginLeft: -5 + 'em', marginRight: -2 + 'em'}}>Jobsite Info</h1>
      <div className="w-1/2 h-3/4"><JobsiteMapWrapper /></div>
    </div>
  );
}
