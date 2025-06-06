import MainView from '@/components/MainView';
import { ActivityIndicator, Text, View } from 'react-native';
import { ScreenHeight, ScreenWidth } from '@/components/global-style';
import useSWR, { Fetcher } from 'swr';
import { Material } from '@/material-api-types';
import { GetUserRow } from '@/user-api-types';
import { useContext } from 'react';
import { IdentityContext } from '@/components/securestore';
import MaterialList from '@/components/MaterialList';
import { getHeaders } from '@/constants/header-options';
import { Link } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

const fetcher: Fetcher<Material[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders()
}).then(res => res.json())
const fetchUser: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders()
}).then(res => res.json())

export default function Materials() {
  const identity = useContext(IdentityContext);
  async function logHeaders() {
    const headers = await getHeaders();
    console.log({ Authorization: headers.Authorization });
  }
  logHeaders();
  const { data: user } = useSWR(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${identity.id}` : null, fetchUser,)
  const { data: materials, error, isLoading, mutate: mutateMaterials } = useSWR(user && user[0] ? `${process.env.EXPO_PUBLIC_API_URL}/api/material/material/search?site=${user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : undefined}` : null, fetcher)


  const handleRefresh = async () => {
    await mutateMaterials();
  };
  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text
  const color = color_scheme === 'dark' ? Colors.dark_box : Colors.light_box

  if (isLoading) { return (<MainView><ActivityIndicator style={{ justifyContent: 'center', height: ScreenHeight }} /></MainView>) }
  if (error) { return (<MainView><Text style={{ color: 'red', justifyContent: 'center', height: '100%' }}>Error occured while trying to load materials</Text></MainView>) }
  if (!materials) { return (<MainView><Text style={{ justifyContent: 'center', height: '100%' }}>No materials to display</Text></MainView>) }
  return (
    <MainView>
      <Text style={{ paddingTop: '5%', alignSelf: 'center', fontSize: 50, textAlign: 'center', fontWeight: 'bold', ...color_text }}>{`Materials for Jobsite ${user && user[0] && user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : "Unknown"}`} </Text>
      <Link style={{
        flex: 0.5, ...color_text, fontSize: 40, ...color,
        width: '95%',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        gap: 10,
      }} href={'/(tabs)/material/add_materials'}>Add a new Material</Link>
      <View style={{ flex: 7 }}>
        <MaterialList materials={materials} 
        onRefresh={handleRefresh}
        refreshing={isLoading} />
      </View>
    </MainView>
  );
}

