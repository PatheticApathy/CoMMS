"use client";

import { useContext, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, FileSpreadsheet, Printer } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import CsvDownloadButton from "react-json-to-csv"
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { User, UserJoin, Company, JobSite, GetUserRow } from "@/user-api-types";
import Loading from "@/components/loading";
import { getToken, IdentityContext } from '@/components/identity-provider';
import { cn } from "@/lib/utils";

const fetcher = async (url: string): Promise<UserJoin[]> => {
  const res = await fetch(url,
    { headers: { 'authorization': getToken() || 'bruh' } }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const fetchUser = async  (url: string): Promise<GetUserRow[]> => {
  const res = await fetch(url,
    { headers: { 'authorization': getToken() || 'bruh' } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const fetchCompanies = async (url: string): Promise<Company[]> => {
  const res = await fetch(url,
    { headers: { 'authorization': getToken() || 'bruh' } }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch companies");
  }
  return res.json();
};

const fetchJobsites = async (url: string): Promise<JobSite[]> => {
  const res = await fetch(url,
    { headers: { 'authorization': getToken() || 'bruh' } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch jobsites");
  }
  return res.json();
};



const Columns = (_companies: Company[] | undefined, _jobsites: JobSite[] | undefined): ColumnDef<User>[] => ([
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("username")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className="">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "company_name",
    header: "Company",
    cell: ({ row }) => {
      const company_name = row.getValue("company_name") as { String: string; Valid: boolean };
    return (
      <div className="">
        {company_name.String}
      </div>
    );
  }
  },
  {
    accessorKey: "jobsite_name",
    header: "Jobsite",
    cell: ({ row }) => {
        const jobsite_name = row.getValue("jobsite_name") as { String: string; Valid: boolean };
      return (
        <div className="">
          {jobsite_name.String}
        </div>
      );
    }
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as { String: string; Valid: boolean };
      return (
        <div className="">
          {role.String}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const role = row.getValue(columnId) as { String: string; Valid: boolean };
      return role.String.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
]);

export default function ContactsTable() {
  const { data, error } = useSWR<UserJoin[]>("/api/user/join", fetcher);
  const { data: companies } = useSWR<Company[]>("/api/company/all", fetchCompanies);
  const { data: jobsites } = useSWR<JobSite[]>("/api/sites/all", fetchJobsites);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const columns = Columns(companies, jobsites)
  const identity = useContext(IdentityContext)

  const { data: currentuser, error: error2 } = useSWR<GetUserRow[], string>(identity ? `/api/user/search?id=${identity?.id}` : null, fetchUser);
  const { data: subordinates, error: error4 } = useSWR<UserJoin[]>(currentuser ? `/api/user/subordinates?user=${currentuser[0].id}&company=${currentuser[0]?.company_id.Int64}&site=${currentuser[0]?.jobsite_id.Int64}` : null, fetcher);
  const table = useReactTable({
    data: subordinates || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (!identity) { return (<p className='flex items-center justify-center w-screen h-screen'>Invalid Token</p>) }

  if (error || error2 || error4) return <p>Invalid User.</p>;
  if (!data) return <p>Loading...</p>;

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!data) {
    return <Loading />;
  }
  console.log(data)

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter username..."
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter company..."
          value={(table.getColumn("company_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("company_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter jobsite..."
          value={(table.getColumn("jobsite_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("jobsite_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter role..."
          value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("role")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <CsvDownloadButton className={cn(buttonVariants({ variant: 'accent' }))} data={data}><FileSpreadsheet /></CsvDownloadButton>
        <Button variant="accent" size="default" onClick={() => window.print()}>
          <Printer />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="accent" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="accent"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
