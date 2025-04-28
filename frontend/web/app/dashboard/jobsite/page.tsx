import JobsiteMapWrapper from "@/components/jobsite-map-wrapper";

export default function JobSitePage() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen w-screen">
      <div className="flex-grow h-full">
        <JobsiteMapWrapper />
      </div>
    </div>
  );
}