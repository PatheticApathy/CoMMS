import FormInput from '@/components/form/form-input';
import { getHeaders } from '@/constants/header-options';
import { Notify } from '@/components/notify';
import { AddMaterial, Material } from '@/material-api-types';
import { GetUserRow, JobSite } from '@/user-api-types';
import { Modal, Text } from 'react-native';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Button } from 'react-native';
import { z } from 'zod'
import FormPictueInput from '@/components/form/FormPictureInput';
import ComboboxFormField from '@/components/form/comboboxFormField';
import FormModalView from '@/components/FormModalView';
import React, { useContext, useState } from 'react';
import MaterialAddMap from './material_add_map'; // Import the MaterialAddMap component
import { IdentityContext } from '@/components/securestore';
import Jobsites from '../jobsites';

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
const PostAddMaterial = async (url: string, { arg }: { arg: AddMaterial }) => await fetch(url, { headers: await getHeaders(), method: 'POST', body: JSON.stringify(arg) });
const PostPicture = async (url: string, { arg }: { arg: { type: string, file: Blob } }) => await fetch(url, { headers: { ...(await getHeaders()), 'Content-Type': `image/${arg.type}` }, method: 'POST', body: arg.file });
const fetchJobsites = async (url: string): Promise<JobSite> => {
  const res = await fetch(url, {
    headers: await getHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch jobsites");
  }
  return res.json();
};

const fetchUser = async (url: string): Promise<GetUserRow[]> => {
  const res = await fetch(url,
    { headers: await getHeaders() }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const AddMaterials = () => {
  // Form controls
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('')
  const [status, setStatus] = useState('In Stock');
  const [type, setType] = useState('');
  const [unit, setUnit] = useState('');
  const [[picture, extension], setPicture] = useState<[Blob | undefined, string]>([undefined, '']);

  const [isDownloading, setDownload] = useState(false);
  const [isMapVisible, setMapVisible] = useState(false); // State to control map modal visibility
  const [locationLat, setLocationLat] = useState<number | null>(null); // Latitude of the marker
  const [locationLng, setLocationLng] = useState<number | null>(null); // Longitude of the marker

  const identity = useContext(IdentityContext)
  const handleOpenMap = () => setMapVisible(true); // Open the map modal
  const handleCloseMap = () => setMapVisible(false); // Close the map modal

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log('Selected Location:', { lat, lng });
    setLocationLat(lat);
    setLocationLng(lng);
    setMapVisible(false);
  };

  const { data: currentUser } = useSWR<GetUserRow[]>(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${identity?.id}` : null, fetchUser);
  const { data: currentSite } = useSWR<JobSite>(currentUser && currentUser[0].jobsite_id.Valid ? `${process.env.EXPO_PUBLIC_API_URL}/api/sites/search?id=${currentUser[0].jobsite_id.Int64}` : null, fetchJobsites);
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
      job_site: currentSite?.id,//only works with jobsite one for now,
      name,
      quantity,
      status,
      type,
      unit,
      picture
    })

    if (validation.success) {
      const values = validation.data;
      const payload: AddMaterial = {
        job_site: values.job_site,
        location_lat: {
          Valid: locationLat !== null,
          Float64: locationLat || 0
        },
        location_lng: {
          Valid: locationLng !== null,
          Float64: locationLng || 0
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
        console.log(picture)
        if (picture) {
          if (extension === '') {
            Notify.error("Invalid file extension");
            setDownload(false)
            return
          }
          const resp = await download({ type: extension, file: picture })
          if (!resp.ok) {
            const message = await resp.json() as { message: string }
            Notify.error(message.message || "Error has occured");
            setDownload(false)
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

  return (
    <FormModalView title="Add New Material">
      <FormInput value={name} keyboardtype="default" placeholder="Name" OnChangeText={setName} />
      <FormInput value={quantity} keyboardtype="number-pad" placeholder="Quantity" OnChangeText={setQuantity} />
      <FormInput value={type} keyboardtype="default" placeholder="Type" OnChangeText={setType} />
      <FormInput value={unit} keyboardtype="default" placeholder="Unit" OnChangeText={setUnit} />
      <FormPictueInput OnPicture={setPicture} />
      <ComboboxFormField default_label={status} options={status_opts} OnClickSet={setStatus} />
      {currentSite ? <Button title="Select Location on Map" onPress={handleOpenMap} /> : <Text>Location picking not available</Text>}
      {isDownloading ? (
        <Button title="sending" />
      ) : (
        <Button onPress={async () => await SendAddMaterialRequest()} title="Add Material" />
      )}

      {/* Map Modal */}
      <Modal visible={isMapVisible} animationType="slide" onRequestClose={handleCloseMap}>
        <MaterialAddMap
          initialRegion={{
            latitude: currentSite!.location_lat.Float64, // Default latitude (e.g., San Francisco)
            longitude: currentSite!.location_lng.Float64, // Default longitude
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          jobSiteLat={currentSite!.location_lat.Float64} // Replace with actual job site latitude
          jobSiteLng={currentSite!.location_lng.Float64} // Replace with actual job site longitude
          onLocationSelect={handleLocationSelect}
          onClose={handleCloseMap}
        />
      </Modal>
    </FormModalView>
  );
};

export default AddMaterials;
