import JobsitePaths from "@/components/jobsite-paths";
import JobsiteMapWrapper from "@/components/jobsite-map-wrapper";

export default function JobSitePage() {

  const site = {
    "id": 9,
    "name": "Louisiana Tech IESB",
    "addr": {
      "String": "Ruston, LA 71270",
      "Valid": true
    },
    "location_lat": {
      "Float64": 32.52634905,
      "Valid": true
    },
    "location_lng": {
      "Float64": -92.64349648220903,
      "Valid": true
    },
    "company_id": {
      "Int64": 1,
      "Valid": true
    }
  }

  return (
    <div className="dark:bg-gray-800 flex flex-col justify-center items-center h-screen w-screen">
      <h1 className="font-bold font-sans text-5xl basis-1/4">Jobsite Info</h1>
      <div><JobsitePaths /></div>
      <div className="w-full h-[500px]"><JobsiteMapWrapper/></div>
    </div>
  );
}
