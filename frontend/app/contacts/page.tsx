import ContactsTable from "@/components/contacts-table"

export default function Contacts() {
  return (
    <div className="dark:bg-gray-800 flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold font-sans text-5xl basis-1/4">Contacts</h1>
      <div className="flex flex-col justify-self-end items-center">
            <ContactsTable />
          </div>
    </div>
  )
}