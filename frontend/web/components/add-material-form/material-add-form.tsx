"use client"
import { Button } from "@/components//ui/button"
import Loading from "@/components/loading"
import {
  Form,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useSWRMutation from "swr/mutation"
import { mutate } from "swr"
import useSWR from "swr"
import { ComboboxFormField } from "@/components/form-maker/form-combobox"
import { Material, AddMaterial } from "@/material-api-types"
import FormInput from "../form-maker/form-input"
import { JobSite } from "@/user-api-types"
import { toast } from "sonner"
import { getToken } from "@/hooks/useToken"
import { Picture } from "@/app/api/picture/route"
import FormFileInput from "../form-maker/form-dropzone"

// Schema for form
const AddMaterialSchema = z.object({
  job_site: z.coerce.number().nonnegative({ message: "Job site must have nonnegative value" }),
  name: z.string().min(1, { message: "Name must be longer than one character" }),
  quantity: z.coerce.number().nonnegative({ message: "Quantity can't be negative" }),
  status: z.enum(["In Stock", "Out of Stock", "Low Stock"]),
  type: z.string().min(2, { message: "Type must be more than 2 characters" }),
  unit: z.string().min(1, { message: "Unit must be greater than 1" }),
  picture: z.instanceof(FileList).optional(),
});

// Fetcher
const PostAddMaterial = async (url: string, { arg }: { arg: AddMaterial }) => await fetch(url, { headers: { 'Authorization': getToken() }, method: 'POST', body: JSON.stringify(arg) });
const PostPicture = async (url: string, { arg }: { arg: Picture }) => await fetch(url, { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify(arg) });
const fetchJobsites = async (url: string): Promise<JobSite[]> => {
  const res = await fetch(url, {
    headers: { 'Authorization': getToken() },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch jobsites");
  }
  return res.json();
};

export default function MaterialForm({ route }: { route: string | undefined }) {
  // Form controller
  const form = useForm<z.infer<typeof AddMaterialSchema>>({
    resolver: zodResolver(AddMaterialSchema),
    defaultValues: {
      job_site: 0,
      name: "",
      quantity: 0,
      status: "In Stock",
      type: "",
      unit: "",
      picture: undefined
    }
  });

  const { data: jobsites, error: jobsitesError, isLoading: loading_jobs } = useSWR<JobSite[]>("/api/sites/all", fetchJobsites);

  const status = [
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ];

  const { trigger, isMutating } = useSWRMutation('/api/material/material/add', PostAddMaterial);
  const { trigger: download, isMutating: isDownloading } = useSWRMutation('/api/picture', PostPicture);

  const SendAddMaterialRequest = async (values: z.infer<typeof AddMaterialSchema>) => {
    const payload: AddMaterial = {
      job_site: values.job_site,
      location_lat: {
        Valid: false,
        Float64: 0
      },
      location_lng: {
        Valid: false,
        Float64: 0
      },
      name: {
        Valid: true,
        String: values.name
      },
      quantity: values.quantity,
      status: values.status,
      type: {
        Valid: true,
        String: values.type
      },
      unit: values.unit,
      picture: { Valid: true, String: "file.svg" }
    };

    try {
      let file_name = "file.svg"

      //send picture and get file name
      console.log(values.picture)
      if (values.picture) {
        toast.message("Sending picture")
        const resp = await download({ name: values.name, contents: await values.picture[0].text() })
        if (!resp.ok) {
          const message = await resp.json() as { message: string }
          toast.error(message.message || "Error has occured");
          return
        }
        const name = await resp.json() as { name: string }
        file_name = name.name
      }

      console.log(`File name is ${file_name}`)
      const resp = await trigger(payload)
      if (!resp.ok) {
        toast.error(await resp.text() || "Error has occured");
        return
      }
      const data = await resp.json() as Material
      toast.success(`Material ${data.name.String} Added!`);
      mutate(route)

    } catch (err: any) {
      console.log(err);
      toast.error(err.message || "Error has occurred");
    }
  };

  const DisplayJobSites = () => {

    if (jobsitesError) {
      return <div className="text-red-500">Error loading jobsites</div>;
    }

    if (loading_jobs) {
      return <div>Loading jobsites...<Loading /></div>;
    }

    if (jobsites) {
      const jobsiteOptions = jobsites.map(jobsite => ({
        label: jobsite.name,
        value: jobsite.id
      }));
      return <ComboboxFormField form_attr={{ name: "job_site", description: "All known jobsites for this location", form: form }} default_label="Choose a jobsite" options={jobsiteOptions} />
    }

    return <div className="text-red-500">No Jobites</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(SendAddMaterialRequest)}>
        <DisplayJobSites />
        <FormInput name="name" placeholder="Name" description="Name of Item" form={form} />
        <FormInput name="quantity" placeholder="Quantity" description="Quantity of item" form={form} />
        <ComboboxFormField form_attr={{ name: "status", description: "Initial status of item", form: form }} default_label={"In Stock"} options={status} />
        <FormInput name="type" placeholder="Type" description="Type of item" form={form} />
        <FormInput name="unit" placeholder="Unit" description="Unit of measurement of item" form={form} />
        <FormFileInput name="picture" placeholder="Add picture" description="Add picture here" form={form} />
        {isMutating || isDownloading ? <Button variant={'ghost'}>Sending</Button> : <Button type="submit">Send Request</Button>}
      </form>
    </Form>
  );
}
