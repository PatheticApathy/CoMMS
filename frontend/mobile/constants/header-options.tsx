import { getToken } from "@/components/securestore";

export const Headers = {
  'Authorization': getToken()!.trim(),
  'CF-Access-Client-Id': process.env.EXPO_PUBLIC_API_CF_CLIENT_ID!,
  'CF-Access-Client-Secret': process.env.EXPO_PUBLIC_API_CF_ACCESS_CLIENT_SECRET!,
}
