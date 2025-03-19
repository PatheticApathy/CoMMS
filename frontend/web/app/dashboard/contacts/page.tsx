"use client";

import { useState } from "react";
import ContactsTable from "@/components/contacts-table";
import InputWithButton from "@/components/search-button";

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");

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