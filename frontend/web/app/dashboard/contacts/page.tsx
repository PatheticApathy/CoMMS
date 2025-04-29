"use client";

import ContactsTable from '@/components/contacts-table';

export default function Contacts() {

  return (
    <div className="flex flex-col justify-center items-center w-full px-4">
      <h1 className="font-bold text-5xl mt-10 mb-4">Contacts</h1>
        <div className="flex flex-col justify-self-end items-center">
          <div className="flex items-center space-x-5">
            <div className="justify-center ml-40 mr-16 mt-10 mb-10">
              <ContactsTable />
            </div>
          </div>
        </div>
    </div>
  );
}
