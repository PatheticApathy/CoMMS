import JobsitePaths from "@/components/jobsite-paths"

export default function JobSite() {
  return (
    <div className="dark:bg-gray-800 flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold font-sans text-5xl basis-1/4">Jobsite Info</h1>
      <JobsitePaths />
    </div>
  )
}
