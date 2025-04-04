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
import { getToken } from "@/hooks/usetoken"

// Schema for form
const AddMaterialSchema = z.object({
  job_site: z.coerce.number().nonnegative({ message: "Job site must have nonnegative value" }),
  name: z.string().min(1, { message: "Name must be longer than one character" }),
  quantity: z.coerce.number().nonnegative({ message: "Quantity can't be negative" }),
  status: z.enum(["In Stock", "Out of Stock", "Low Stock"]),
  type: z.string().min(2, { message: "Type must be more than 2 characters" }),
  unit: z.string().min(1, { message: "Unit must be greater than 1" })
});

// Fetcher
const PostAddMaterial = async (url: string, { arg }: { arg: AddMaterial }) => await fetch(url, { headers: { 'Authorization': getToken() }, method: 'POST', body: JSON.stringify(arg) });
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
      unit: ""
    }
  });

  const { data: jobsites, error: jobsitesError, isLoading: loading_jobs } = useSWR<JobSite[]>("/api/sites/all", fetchJobsites);

  const status = [
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ];

  const { trigger, isMutating } = useSWRMutation('/api/material/material/add', PostAddMaterial, {
    onError(err) {
      console.log(err);
      toast.error(err.message || "Error has occurred");
    },
    onSuccess(data) {
      if (!data.ok) {
        toast.error(data.text() || "Error has occured");
        return
      }
      data.json().then((resp: Material) => {
        console.log("success");
        toast.success(`Material ${resp.name.String} Added!`);
        mutate(route)
      });
    },
  });

  const SendAddMaterialRequest = (values: z.infer<typeof AddMaterialSchema>) => {
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
      unit: values.unit
    };
    trigger(payload);
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
        {isMutating ? <Button variant={'ghost'}>Sending</Button> : <Button type="submit">Send Request</Button>}
      </form>
    </Form>
  );
}
