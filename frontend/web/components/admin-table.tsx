"use client";

import * as React from "react";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import InitAddFormDialougeAdmin from "@/components/add-jobsite-form/jobsite-add-admin";

import useSWR from "swr";
import { User, UserJoin, Company, JobSite, Token } from "@/user-api-types";
import Loading from "@/components/loading";
import { getToken } from "./localstorage";
//import { getToken, useIdentity } from '@/hooks/useToken';

const fetcher = async (url: string): Promise<UserJoin[]> => {
  const res = await fetch(url,
    { headers: { 'authorization': getToken() || 'bruh' } }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const fetchUser = async  (url: string): Promise<User> => {
  const res = await fetch(url,
    { headers: { 'authorization': getToken() || 'bruh' } }
  )
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const fetchCompanies = async (url: string): Promise<Company[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch companies");
  }
  return res.json();
};

const fetchJobsites = async (url: string): Promise<JobSite[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch jobsites");
  }
  return res.json();
};

const deleteUser = async (id: number) => {
  const res = await fetch(`/api/user/delete?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
  return res.json();
};

const updateUser = async (id: number, field: string, value: { String: string; Valid: boolean} | { Int64: number; Valid: boolean }) => {
  const res = await fetch(`/api/user/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, [field]: value }),
  });
  if (!res.ok) {
    throw new Error("Failed to update user");
  }
  return res.json();
};

export const columns: ColumnDef<User>[] = [
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const [newCompany, setNewCompany] = React.useState("");
      const [newJobsite, setNewJobsite] = React.useState("");
      const [newRole, setNewRole] = React.useState("");

      const { data: companies } = useSWR<Company[]>("/api/company/all", fetchCompanies);
      const { data: jobsites } = useSWR<JobSite[]>("/api/sites/all", fetchJobsites);

      const handleUpdateCompany = (e: React.FormEvent) => {
        e.preventDefault();
        const company = companies?.find(c => c.name.toLowerCase() === newCompany.toLowerCase());
        if (company) {
          updateUser(user.id, "company_id", { Int64: company.id, Valid: true });
        } else {
          console.error("Company not found");
        }
      };

      const handleUpdateJobsite = (e: React.FormEvent) => {
        e.preventDefault();
        const jobsite = jobsites?.find(j => j.name.toLowerCase() === newJobsite.toLowerCase());
        if (jobsite) {
          updateUser(user.id, "jobsite_id", { Int64: jobsite.id, Valid: true });
        } else {
          console.error("Jobsite not found");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id.toString())}
            >
              Copy id #
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => deleteUser(user.id)}
            >
              Delete user
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.preventDefault()}>
              <Input
                placeholder="New Company"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={handleUpdateCompany}>
                Change company
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.preventDefault()}>
              <Input
                placeholder="New Site"
                value={newJobsite}
                onChange={(e) => setNewJobsite(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={handleUpdateJobsite}>
                Change jobsite
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.preventDefault()}>
              <Input
                placeholder="New Role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={(e) => { e.preventDefault(); updateUser(user.id, "role", { String: newRole, Valid: true}); }}>
                Change role
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

async function getProfileArgs(url: string, arg: string) {
  return fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: arg
  }).then(res => res.json() as Promise<Token>)
}

const token = getToken()

export function UserTable() {
  const { data, error } = useSWR<UserJoin[]>("/api/user/join", fetcher);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  if (!token) { return (<p className='flex items-center justify-center w-screen h-screen'>Invalid Token</p>) }

  const { data: tokenData, error: error2 } = useSWR(['/api/user/decrypt', token], ([url, token]) => getProfileArgs(url, token))
  //const identity = useIdentity();
  //const { data: user } = useSWR(identity ? `/api/user/search?id=${identity.id}` : null, fetchUser,)
  const { data: currentuser, error: error3 } = useSWR<User, string>(tokenData ? `/api/user/search?id=${tokenData?.id}` : null, fetchUser);
  //const { data, error } = useSWR<UserJoin[]>(identity && user ? `/api/user/subordinates?user=${identity.id}&company=${user?.company_id.Int64}&site=${user?.jobsite_id.Int64}` : null, fetcher);
  console.log(tokenData ? `/api/user/coworkers?user=${tokenData.id}&company=${currentuser?.company_id.Int64}&site=${currentuser?.jobsite_id.Int64}` : null) 
  const table = useReactTable({
    data: data || [],
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

  //if (!identity) { return (<div className='flex items-center justify-center w-screen h-screen'>Loading <Loading /></div>) }
  if (error) return <p>Invalid User.</p>;
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
        <InitAddFormDialougeAdmin/>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
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
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
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