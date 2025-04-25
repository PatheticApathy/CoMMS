"use client";

import { useState } from "react";
import ContactsTable from "@/components/contacts-table";
import InputWithButton from "@/components/search-button";
import { Coworker } from "@/user-api-types";
import { Button, buttonVariants } from "@/components/ui/button";
import CsvDownloadButton from "react-json-to-csv"
import { cn } from "@/lib/utils";
import { FileSpreadsheet, Printer } from "lucide-react";


export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [table_data, setTableData] = useState<Coworker[]>([]);


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
          <CsvDownloadButton className={cn(buttonVariants({ variant: 'accent' }))} data={table_data}><FileSpreadsheet /></CsvDownloadButton>
          <Button variant="accent" onClick={handlePrint}>
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
