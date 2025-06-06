import React from 'react';
import { Button, View, Text } from 'react-native';
import { Link, Redirect } from 'expo-router';
import MainView from '@/components/MainView';
import { ScreenHeight } from '@/components/global-style'
import { getToken } from '@/components/securestore';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

export default function Welcome() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    getToken().then(token => {
      if (token) {
        setIsAuthenticated(true);
      }
    });
  }, []);

  const color_scheme = useColorScheme()
  const color_text = color_scheme === 'dark' ? Colors.dark_text : Colors.light_text

  if (isAuthenticated) { return <Redirect href={'/(tabs)/home'} /> }
  return (
    <MainView>
      <View style={{ flex: 1, paddingTop: ScreenHeight * 0.1 }}>
        <Text style={{ flex: 1, alignSelf: 'center', fontSize: 30, textAlign: 'center', ...color_text }}>Welcome to CoMMS</Text>
        <Text style={{ flex: 2, fontSize: 25, textAlign: 'center', ...color_text }}>The Construction Material Management System</Text>
      </View>
      <View style={{ flex: 2, alignItems: 'center' }}>
        <Text style={{ fontSize: 21, textAlign: 'center', ...color_text }}>
          The Construction Material Management System, or CoMMS, is a system through which employees of construction
          companies, or companies in fields that require similar material tracking, can keep track of materials throughout a job site. This system
          is designed to be used through this website for easy accessibility.
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Link href="/login" asChild>
          <Button title="Go to Login"></Button>
        </Link>
      </View>
    </MainView>
  );
}
