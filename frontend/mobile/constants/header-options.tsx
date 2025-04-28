import * as SecureStore from 'expo-secure-store';
import { getToken } from "@/components/securestore";

export async function getHeaders() {
  const token = await getToken();
  return {
    'Authorization': token || '',
    'CF-Access-Client-Id': process.env.EXPO_PUBLIC_API_CF_CLIENT_ID!,
    'CF-Access-Client-Secret': process.env.EXPO_PUBLIC_API_CF_ACCESS_CLIENT_SECRET!,
  };
}

export const BlockingHeaders = {
  'Authorization': SecureStore.getItem('token') || '',
  'CF-Access-Client-Id': process.env.EXPO_PUBLIC_API_CF_CLIENT_ID!,
  'CF-Access-Client-Secret': process.env.EXPO_PUBLIC_API_CF_ACCESS_CLIENT_SECRET!,
}
