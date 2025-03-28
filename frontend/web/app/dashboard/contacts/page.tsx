"use client";

import { useState } from "react";
import ContactsTable from "@/components/contacts-table";
import InputWithButton from "@/components/search-button";
import { getToken } from "@/components/localstorage";
import useSWR, { Fetcher } from "swr";
import { Token } from "@/user-api-types";

const tkn = getToken()
const TokenFetcher: Fetcher<Token, string> = async (...args) => fetch(...args, { method: 'POST', body: tkn, cache: 'force-cache' },).then(res => res.json())

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: token, isLoading: t_loading } = useSWR('/api/user/decrypt', TokenFetcher,)

  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <h1 className="font-bold text-5xl mb-4">Contacts</h1>
      <div className="flex flex-col justify-self-end items-center">
        <InputWithButton onSearch={setSearchQuery} />
        <ContactsTable searchQuery={searchQuery} />
      </div>
    </div>
  );
}
