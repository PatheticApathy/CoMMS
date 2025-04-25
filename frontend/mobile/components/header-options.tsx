import { getToken } from "@/app/(tabs)/securestore";

export const Headers = {
  'Authorization': getToken() || '',
  'CF-Access-Client-Id': process.env.EXPO_PUBLIC_API_CF_CLIENT_ID!,
  'CF-Access-Client-Secret': process.env.EXPO_PUBLIC_API_CF_ACCESS_CLIENT_SECRET!,
}