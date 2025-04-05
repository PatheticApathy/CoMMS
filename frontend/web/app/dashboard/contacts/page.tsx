"use client";

import { useState } from "react";
import ContactsTable from "@/components/contacts-table";
import InputWithButton from "@/components/search-button";
import { getToken } from "@/components/identity-provider";
import useSWR, { Fetcher } from "swr";
import { Token, UserJoin } from "@/user-api-types";
import { Button, buttonVariants } from "@/components/ui/button";
import CsvDownloadButton from "react-json-to-csv"
import { cn } from "@/lib/utils";
import { FileSpreadsheet, Printer } from "lucide-react";


const tkn = getToken();
const TokenFetcher: Fetcher<Token, string> = async (...args) => fetch(...args, { method: "POST", body: tkn, cache: "force-cache" }).then((res) => res.json());

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: token, isLoading: t_loading } = useSWR("/api/user/decrypt", TokenFetcher);
  const [table_data, setTableData] = useState<UserJoin[]>([]);


  const handlePrint = () => {
    const printContents = document.getElementById("contacts-table")?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen">
      <h1 className="font-bold text-5xl mb-4">Contacts</h1>
      <div className="flex flex-col justify-self-end items-center">
        <div className="flex items-center space-x-5">
          <InputWithButton onSearch={setSearchQuery} />
          <CsvDownloadButton className={cn(buttonVariants({ variant: 'outline' }))} data={table_data}><FileSpreadsheet /></CsvDownloadButton>
          <Button variant="outline" onClick={handlePrint}>
            <Printer />
          </Button>
        </div>
        <div id="contacts-table">
          <ContactsTable searchQuery={searchQuery} tableData={table_data} tableAction={setTableData} />
        </div>
      </div>
    </div>
  );
}
