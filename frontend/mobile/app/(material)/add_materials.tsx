import FormInput from '@/components/form/form-input';
import { ScreenHeight } from '@/components/global-style';
import { Headers } from '@/components/header-options';
import MainView from '@/components/MainView';
import { Notify } from '@/components/notify';
import { AddMaterial, Material } from '@/material-api-types';
import { JobSite } from '@/user-api-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Text } from 'react-native';
import useSWR from 'swr';
import useSWRMutation from 'swr/dist/mutation';
import { Button } from 'react-native';
import { z } from 'zod'
import FormPictueInput from '@/components/form/FormPictureInput';
import ComboboxFormField from '@/components/form/comboboxFormField';

// Schema for form
const AddMaterialSchema = z.object({
  job_site: z.coerce.number().nonnegative({ message: "Job site must have nonnegative value" }),
  name: z.string().min(1, { message: "Name must be longer than one character" }),
  quantity: z.coerce.number().nonnegative({ message: "Quantity can't be negative" }),
  status: z.enum(["In Stock", "Out of Stock", "Low Stock"]),
  type: z.string().min(2, { message: "Type must be more than 2 characters" }),
  unit: z.string().min(1, { message: "Unit must be greater than 1" }),
  picture: z.instanceof(File).optional(),
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

const AddMaterials = () => {
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
      if (values.picture) {
        const extension = values.picture.name.split('.').pop()
        if (!extension) {
          Notify.error("Invald file extension");
          return
        }
        const resp = await download({ type: extension, file: values.picture })
        if (!resp.ok) {
          const message = await resp.json() as { message: string }
          Notify.error(message.message || "Error has occured");
          return
        }
        const name = await resp.json() as { name: string }
        payload.picture.String = `/${name.name}`
      }

      console.log(`File name is ${payload.picture.String}`)
      const resp = await trigger(payload)
      if (!resp.ok) {
        Notify.error(await resp.text() || "Error has occured");
        return
      }
      const data = await resp.json() as Material
      Notify.success(`Material ${data.name.String} Added!`);

    } catch (err: any) {
      console.log(err);
      Notify.error(err.message || "Error has occurred");
    }
  };

  const DisplayJobSites = () => {

    if (jobsitesError) {
      return <Text>Error loading jobsites</Text>;
    }

    if (loading_jobs) {
      return <ActivityIndicator style={{ justifyContent: 'center', height: ScreenHeight }} />;
    }

    if (jobsites) {
      const jobsiteOptions = jobsites.map(jobsite => ({
        label: jobsite.name,
        value: jobsite.id
      }));
      return <ComboboxFormField form_attr={{ name: "job_site", form: form }} default_label="Choose a jobsite" options={jobsiteOptions} />
    }

    return <Text>No Jobites</Text>
  }

  if (loading_jobs) { return (<MainView><ActivityIndicator style={{ justifyContent: 'center', height: ScreenHeight }} /></MainView>) }

  //make button change colores on submission
  return (
    <MainView>
      <DisplayJobSites />
      <FormInput name="name" placeholder="Name" control={form.control} />
      <FormInput name="quantity" placeholder="Quantity" control={form.control} />
      <ComboboxFormField form_attr={{ name: "status", form: form }} default_label={"In Stock"} options={status} />
      <FormInput name="type" placeholder="Type" control={form.control} />
      <FormInput name="unit" placeholder="Unit" control={form.control} />
      <FormPictueInput name="picture" placeholder="Add picture" form={form} />
      {isMutating || isDownloading ? <Button onPress={form.handleSubmit(SendAddMaterialRequest)} title='sending' /> : <Button title='Add Material' />}
    </MainView>
  )
}

export default AddMaterials


