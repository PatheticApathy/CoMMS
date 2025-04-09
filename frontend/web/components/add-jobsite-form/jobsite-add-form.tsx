"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR, { Fetcher } from "swr";
import useSWRMutation from "swr/mutation";
import { ComboboxFormField } from "@/components/form-maker/form-combobox";
import FormInput from "../form-maker/form-input";
import { toast } from "sonner";
import { JobSite, AddJobSiteParams, Company } from "@/user-api-types";
import { getToken } from "@/components/identity-provider";

// Schema for form
const AddJobsiteSchema = z.object({
  name: z.string().min(1, { message: "Name must be longer than one character" }),
  addr: z.string().min(1, { message: "Address must be longer than one character" }),
  location_lat: z.coerce.number({ message: "Must be a number or float" }),
  location_lng: z.coerce.number({ message: "Must be a number or float" }),
  company_id: z.coerce.number().nonnegative({ message: "Company must exist" }),
});

// Fetcher
const PostAddJobsite = async (url: string, { arg }: { arg: AddJobSiteParams }) => fetch(url, { headers: { 'Authorization': getToken() }, method: 'POST', body: JSON.stringify(arg) });

const fetchCompanies: Fetcher<Company[], string> = async (...args) => fetch(...args, { headers: { 'Authorization': getToken() } }).then((res) => res.json());

export default function JobsiteForm() {
  // Form controller
  const form = useForm<z.infer<typeof AddJobsiteSchema>>({
    resolver: zodResolver(AddJobsiteSchema),
    defaultValues: {
      name: "",
      addr: "",
      location_lat: undefined,
      location_lng: undefined,
      company_id: 0
    }
  });

  const { data: companies, error: companiesError } = useSWR("/api/company/all", fetchCompanies);

  const { trigger, isMutating } = useSWRMutation('/api/sites/add', PostAddJobsite, {
    onError(err) {
      console.log(err);
      toast.error(err.message || "Error has occurred");
    },
    onSuccess(resp) {
      if (!resp.ok) {
        resp.text().then((text) => {
        toast.error(text || "Error has occurred");
        })
        return
      }
      resp.json().then((data: JobSite) => {
        console.log("success");
        toast.success(`Jobsite ${data.name.toString()} Added!`);
      });
    },
  });

  const SendAddJobsiteRequest = (values: z.infer<typeof AddJobsiteSchema>) => {
    const payload: AddJobSiteParams = {
      location_lat: {
        Valid: true,
        Float64: values.location_lat
      },
      location_lng: {
        Valid: true,
        Float64: values.location_lng
      },
      name: values.name,
      addr: {
        Valid: true,
        String: values.addr
      },
      company_id: values.company_id
    };
    console.log(payload);
    trigger(payload);
  };

  if (companiesError) {
    return <div>Error loading companies</div>;
  }

  if (!companies) {
    return <div>Loading companies...</div>;
  }

  const companiesOptions = companies.map(companies => ({
    label: companies.name,
    value: companies.id
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(SendAddJobsiteRequest)}>
        <ComboboxFormField form_attr={{ name: "company_id", description: "All known companies", form: form }} default_label="Choose a company" options={companiesOptions} />
        <FormInput name="name" placeholder="Name" description="" form={form} />
        <FormInput name="addr" placeholder="Address" description="" form={form} />
        <FormInput name="location_lat" placeholder="Latitude Coordinate" description="" form={form} />
        <FormInput name="location_lng" placeholder="Longitude Coordinate" description="" form={form} />
        {isMutating ? <Button variant={'ghost'}>Sending</Button> : <Button type="submit">Add Jobsite</Button>}
      </form>
    </Form>
  );
}