"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import FormInput from "../form-maker/form-input";
import { toast } from "sonner";
import { AddCompanyParams, Company } from "@/user-api-types";
import { getToken } from "@/components/identity-provider";

// Schema for form
const AddCompanySchema = z.object({
  name: z.string().min(1, { message: "Name must be longer than one character" }),
  addr: z.string().min(1, { message: "Address must be longer than one character" }),
  location_lat: z.coerce.number({ message: "Must be a number or float" }),
  location_lng: z.coerce.number({ message: "Must be a number or float" }),
});

// Fetcher
const PostAddCompany = async (url: string, { arg }: { arg: AddCompanyParams }) => await fetch(url, { headers: { 'Authorization': getToken() }, method: 'POST', body: JSON.stringify(arg) });

export default function CompanyForm() {
  // Form controller
  const form = useForm<z.infer<typeof AddCompanySchema>>({
    resolver: zodResolver(AddCompanySchema),
    defaultValues: {
      name: "",
      addr: "",
      location_lat: undefined,
      location_lng: undefined,
    }
  });

  const { trigger, isMutating } = useSWRMutation('/api/company/create', PostAddCompany, {
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
      resp.json().then((data: Company) => {
        console.log("success");
        toast.success(`Company ${data.name.toString()} Added!`);
      });
    },
  });

  const SendAddCompanyRequest = (values: z.infer<typeof AddCompanySchema>) => {
    const payload: AddCompanyParams = {
      location_lat: {
        Valid: false,
        Float64: values.location_lat
      },
      location_lng: {
        Valid: false,
        Float64: values.location_lng
      },
      name: values.name,
      addr: {
        Valid: false,
        String: values.addr
      },
    };
    console.log(payload);
    trigger(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(SendAddCompanyRequest)}>
        <FormInput name="name" placeholder="Name" description="" form={form} />
        <FormInput name="addr" placeholder="Address" description="" form={form} />
        <FormInput name="location_lat" placeholder="Latitude Coordinate" description="" form={form} />
        <FormInput name="location_lng" placeholder="Longitude Coordinate" description="" form={form} />
        {isMutating ? <Button variant={'ghost'}>Sending</Button> : <Button variant="yellow" type="submit">Add Company</Button>}
      </form>
    </Form>
  );
}