import FormInput from '@/components/form/form-input';
import { ScreenHeight } from '@/components/global-style';
import { Headers } from '@/components/header-options';
import MainView from '@/components/MainView';
import { Notify } from '@/components/notify';
import { AddMaterial, Material } from '@/material-api-types';
import { JobSite } from '@/user-api-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import useSWR from 'swr';
import useSWRMutation from 'swr/dist/mutation';
import { Button } from 'react-native';
import { z } from 'zod'

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
const PostAddMaterial = async (url: string, { arg }: { arg: AddMaterial }) => await fetch(url, { headers: Headers, method: 'POST', body: JSON.stringify(arg) });
const PostPicture = async (url: string, { arg }: { arg: { type: string, file: Blob } }) => await fetch(url, { headers: { ...Headers, 'Content-Type': `image/${arg.type}` }, method: 'POST', body: arg.file });
const fetchJobsites = async (url: string): Promise<JobSite[]> => {
  const res = await fetch(url, {
    headers: Headers,
  });
  if (!res.ok) {
    throw new Error("Failed to fetch jobsites");
  }
  return res.json();
};

export default function AddMaterialForm() {
  // Form controller
  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof AddMaterialSchema>>({
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

    AddMaterialSchema.parse(values)
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
      picture: { Valid: true, String: "/file.svg" }
    };

    try {
      if (values.picture && values.picture?.length > 0) {
        const extension = values.picture[0].name.split('.').pop()
        if (!extension) {
          setError(new Error("Invald file extension"));
          return
        }
        const resp = await download({ type: extension, file: values.picture[0] })
        if (!resp.ok) {
          const message = await resp.json() as { message: string }
          setError(new Error(message.message || "Error has occured"));
          return
        }
        const name = await resp.json() as { name: string }
        payload.picture.String = `/${name.name}`
      }

      console.log(`File name is ${payload.picture.String}`)
      const resp = await trigger(payload)
      if (!resp.ok) {
        setError(new Error(await resp.text() || "Error has occured"));
        return
      }
      const data = await resp.json() as Material
      Notify.success(`Material ${data.name.String} Added!`);

    } catch (err: any) {
      console.log(err);
      setError(new Error(err.message || "Error has occurred"));
    }
  };



  if (loading_jobs) { return (<MainView><ActivityIndicator style={{ justifyContent: 'center', height: ScreenHeight }} /></MainView>) }

  //make button change colores on submission
  return (
    <View>
      <DisplayJobSites />
      <FormInput name="name" placeholder="Name" control={control} />
      <FormInput name="quantity" placeholder="Quantity" control={control} />
      <ComboboxFormField form_attr={{ name: "status", control: control }} default_label={"In Stock"} options={status} />
      <FormInput name="type" placeholder="Type" control={control} />
      <FormInput name="unit" placeholder="Unit" control={control} />
      <FormFileInput name="picture" placeholder="Add picture" control={control} />
      {isMutating || isDownloading ? <Button onPress={handleSubmit(SendAddMaterialRequest)} title='sending' /> : <Button title='Add Materterial' />}
    </View>
  );
}
