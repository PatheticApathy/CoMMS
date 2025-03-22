'use client'
import { Material } from '@/material-api-types';
import useSWR, { Fetcher } from 'swr'
import Loading from '@/components/loading';
import FilterAndTable from '@/components/table-material/material-filter+table';
import InitAddFormDialouge from "@/components/add-material-form/material-add-form-button";
import { getToken } from '@/components/localstorage';
import { Token } from '@/user-api-types';

const tkn = getToken()
const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args,).then(res => res.json())
const TokenFetcher: Fetcher<Token, string> = async (...args) => fetch(...args, { method: 'POST', body: tkn, cache: 'force-cache' },).then(res => res.json())


export default function AllMaterialPage() {

  const { data: token, isLoading: t_loading } = useSWR('/api/user/decrypt', TokenFetcher,)
  const { data: materials, error, isLoading } = useSWR(token ? `/api/material/material/search?site=${token.id}` : null, fetcher)
  console.log(token)
  console.log(materials)

  if (isLoading || t_loading) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) { return (<p className='flex items-center justify-center w-screen h-screen'>Error occured while trying to load materials</p>) }
  return (
    <div>
      <FilterAndTable route={token ? `/api/material/material/search?site=${token.id}` : undefined} header="Materials" materials={materials} />
      <InitAddFormDialouge materials={materials} />
    </div>
  );
}
