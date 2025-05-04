import MainView from '@/components/MainView';
import { ActivityIndicator, Text, View, TextInput, StyleSheet } from 'react-native';
import { ScreenHeight } from '@/components/global-style';
import useSWR, { Fetcher } from 'swr';
import { Coworker, GetUserRow } from '@/user-api-types';
import { useContext, useState } from 'react';
import { IdentityContext } from '@/components/securestore';
import ContactsList from '@/components/ContactsList';
import { getHeaders } from '@/constants/header-options';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

const fetcher: Fetcher<Coworker[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders()
}).then(res => res.json())
const fetchUser: Fetcher<GetUserRow[], string> = async (...args) => fetch(...args, {
  headers: await getHeaders()
}).then(res => res.json())

export default function Coworkers() {
  const identity = useContext(IdentityContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCoworkers, setFilteredCoworkers] = useState<Coworker[]>([]);
  
  const { data: user } = useSWR(identity ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/search?id=${identity.id}` : null, fetchUser,)
  const { data: coworkers, error, isLoading } = useSWR(user && user[0] ? `${process.env.EXPO_PUBLIC_API_URL}/api/user/coworkers?user=${user[0].id}&company=${user[0].company_id.Valid ? user[0].company_id.Int64 : undefined}&site=${user[0].jobsite_id.Valid ? user[0].jobsite_id.Int64 : undefined}` : null, fetcher);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (coworkers) {
      const filtered = coworkers.filter((coworker) => {
        const searchLower = query.toLowerCase();
        return (
          coworker.username.toLowerCase().includes(searchLower) ||
          coworker.email.toLowerCase().includes(searchLower) ||
          coworker.phone.toLowerCase().includes(searchLower) ||
          (coworker.firstname.Valid && coworker.firstname.String.toLowerCase().includes(searchLower)) ||
          (coworker.lastname.Valid && coworker.lastname.String.toLowerCase().includes(searchLower)) ||
          coworker.company_name.toLowerCase().includes(searchLower) ||
          coworker.jobsite_name.toLowerCase().includes(searchLower) ||
          (coworker.role.Valid && coworker.role.String.toLowerCase().includes(searchLower))
        );
      });
      setFilteredCoworkers(filtered);
    }
  };

  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text

  if (isLoading) { return (<MainView><ActivityIndicator style={{ justifyContent: 'center', height: ScreenHeight }} /></MainView>) }
  if (error) { return (<MainView><Text style={{ color: 'red', justifyContent: 'center', height: '100%' }}>Error occured while trying to load coworkers</Text></MainView>) }
  if (!coworkers) { return (<MainView><Text style={{ justifyContent: 'center', height: '100%' }}>No coworkers to display</Text></MainView>) }
  
  return (
    <MainView>
      <Text style={{ paddingTop: '20%', flex: 1, alignSelf: 'center', fontSize: 40, textAlign: 'center', fontWeight: 'bold', ...color_text }}>Coworkers</Text>
      <TextInput 
        style={{ ...styles.searchInput, ...color_text }}
        placeholder="Search coworkers..."
        placeholderTextColor = {color_scheme === 'dark' ? '#C9ADA7' : '#00272B'}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <View style={{ flex: 10 }}>
        <ContactsList coworkers={searchQuery ? filteredCoworkers : coworkers} />
      </View>
    </MainView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    margin: 10,
    borderRadius: 10,
    fontSize: 20,
    
  },
});