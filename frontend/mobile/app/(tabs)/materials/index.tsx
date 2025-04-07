import MainView from '@/components/MainView';
import { ActivityIndicator, Text, View } from 'react-native';
import { ScreenHeight } from '@/components/global-style';
import useSWR, { Fetcher } from 'swr';
import { Material } from '@/material-api-types';
import { GetUserRow } from '@/user-api-types';
import { useContext } from 'react';
import { IdentityContext } from '@/components/securestore';
import MaterialList from '@/components/MaterialList';
import { Headers } from '@/constants/header-options';

const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args, {
  headers: Headers
}).then(res => res.json())
const fetchUser: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, {
  headers: Headers
}).then(res => res.json())

export default function Materials() {
  const identity = useContext(IdentityContext);
  console.log(identity)
  const { data: user } = useSWR(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${identity.id}` : null, fetchUser,)
  const { data: materials, error, isLoading } = useSWR(user && user[0] ? `${process.env.EXPO_PUBLIC_API_URL}/api/material/material/search?site=${user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : undefined}` : null, fetcher)

  if (isLoading) { return (<MainView><ActivityIndicator style={{ justifyContent: 'center', height: ScreenHeight }} /></MainView>) }
  if (error || !materials) { return (<MainView><Text style={{ color: 'red', justifyContent: 'center', height: '100%' }}>Error occured while trying to load materials</Text></MainView>) }
  return (
    <MainView>
      <View style={{ flexDirection: 'column' }}>
        <Text style={{ paddingTop: ScreenHeight * 0.1, flex: 1, alignSelf: 'center', fontSize: 40, textAlign: 'center' }}>Materials for Jobsite :insertjobsitehere</Text>
      </View>
      <MaterialList materials={materials} />
    </MainView>
  );
}

