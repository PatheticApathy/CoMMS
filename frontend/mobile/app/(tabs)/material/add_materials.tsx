import FormInput from '@/components/form/form-input';
import { ScreenHeight } from '@/components/global-style';
import { Headers } from '@/constants/header-options';
import MainView from '@/components/MainView';
import { Notify } from '@/components/notify';
import { AddMaterial, Material } from '@/material-api-types';
import { JobSite } from '@/user-api-types';
import { ActivityIndicator, Text } from 'react-native';
import useSWR from 'swr';
import useSWRMutation from 'swr/dist/mutation';
import { Button } from 'react-native';
import { z } from 'zod'
import FormPictueInput from '@/components/form/FormPictureInput';
import ComboboxFormField from '@/components/form/comboboxFormField';
import FormModalView from '@/components/FormModalView';
import { useState } from 'react';

// Schema for form
const AddMaterialSchema = z.object({
  job_site: z.coerce.number().nonnegative({ message: "Job site must have nonnegative value" }),
  name: z.coerce.string().min(1, { message: "Name must be longer than one character" }),
  quantity: z.coerce.number({ message: 'Quantity must be a number' }).nonnegative({ message: "Quantity can't be negative" }),
  status: z.enum(["In Stock", "Out of Stock", "Low Stock"]),
  type: z.coerce.string().min(2, { message: "Type must be more than 2 characters" }),
  unit: z.coerce.string().min(1, { message: "Unit must be greater than 1" }),
  picture: z.instanceof(Blob).optional(),
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
  // Form controls
  const [job_site, setJobSite] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('')
  const [status, setStatus] = useState('In Stock');
  const [type, setType] = useState('');
  const [unit, setUnit] = useState('');
  // const [location_lat, setLocationLat] = useState(''); //Needed for map marker.
  // const [location_lng, setLocationLng] = useState(''); //Set in map view.
  const [[picture, extension], setPicture] = useState<[Blob | undefined, string]>([undefined, '']);

  const [isDownloading, setDownload] = useState(false);


  const { data: jobsites, error: jobsitesError, isLoading: loading_jobs } = useSWR<JobSite[]>(`${process.env.EXPO_PUBLIC_API_URL}/api/sites/all`, fetchJobsites);
  const { trigger } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/material/material/add`, PostAddMaterial);
  const { trigger: download } = useSWRMutation(`${process.env.EXPO_PUBLIC_API_URL}/api/picture`, PostPicture);

  const status_opts = [
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ];


  const SendAddMaterialRequest = async () => {
    setDownload(true)
    const validation = AddMaterialSchema.safeParse({
      job_site: 1,//only works with jobsite one for now,
      name,
      quantity,
      status,
      type,
      unit,
      // location_lat, //not used for now
      // location_lng, //not used for now
      picture
    })

    if (validation.success) {
      const values = validation.data;
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
        // location_lat: values.location_lat,
        // type:{
        //  Valid: true,
        //  Float64: values.location_lat
        // },                                       // not used for now
        // location_lng: values.location_lng,
        // type:{
        //  Valid: true,
        //  Float64: values.location_lng
        // },
        picture: { Valid: true, String: "/file.svg" }
      };

      try {
        console.log(picture)
        if (picture) {
          if (extension === '') {
            Notify.error("Invalid file extension");
            return
          }
          const resp = await download({ type: extension, file: picture })
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
          setDownload(false)
          return
        }
        const data = await resp.json() as Material
        Notify.success(`Material ${data.name.String} Added!`);
        setDownload(false)

      } catch (err: any) {
        console.log(err);
        Notify.error(err.message || "Error has occurred");
        setDownload(false)
      }
    } else {
      console.log(JSON.stringify(validation.error.format(), null, 2))
      Notify.error(validation.error.issues.map((issue) => {
        return issue.message
      }).join('\n'))
    }
    setDownload(false)
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
      return <ComboboxFormField default_label={job_site} OnClickSet={setJobSite} options={jobsiteOptions} />
    }

    return <Text>No Jobites</Text>
  }

  if (loading_jobs) { return (<MainView><ActivityIndicator style={{ justifyContent: 'center', height: ScreenHeight }} /></MainView>) }

  //make button change colores on submission
  return (
    <FormModalView title='Add New Material'>
      <DisplayJobSites />
      <FormInput value={name} keyboardtype='default' placeholder="Name" OnChangeText={setName} />
      <FormInput value={quantity} keyboardtype='number-pad' placeholder="Quantity" OnChangeText={setQuantity} />
      <FormInput value={type} keyboardtype='default' placeholder="Type" OnChangeText={setType} />
      <FormInput value={unit} keyboardtype='default' placeholder="Unit" OnChangeText={setUnit} />
      <ComboboxFormField default_label={status} options={status_opts} OnClickSet={setStatus} />
      <FormPictueInput OnPicture={setPicture} />
      {/* Some form of material add map that will allow you to place the marker.
          react-native-maps does have a lot of dynamic markers to use.          */}
      {isDownloading ? <Button title='sending' /> : <Button onPress={async () => { await SendAddMaterialRequest() }} title='Add Material' />}
    </FormModalView>
  )
}

export default AddMaterials


