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
import { ArrowUpDown, ChevronDown, MoreHorizontal, FileSpreadsheet, Printer } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import CsvDownloadButton from "react-json-to-csv"
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

import useSWR, { Fetcher } from "swr";
import { Material } from "@/material-api-types";
import Loading from "@/components/loading";
import InitAddFormDialougeAdmin from "@/components/add-material-form/material-add-admin";
import { cn } from "@/lib/utils";
import { getToken, IdentityContext } from '@/components/identity-provider';
import { User } from '@/user-api-types';
import { useContext } from 'react';

const fetchUser: Fetcher<User, string> = async (...args) => fetch(...args, { headers: { Authorization: getToken() } }).then((res) => res.json());
const fetchMaterial: Fetcher<Material[], string> = async (...args) => fetch(...args, { headers: { Authorization: getToken() } }).then((res) => res.json());


const deleteMaterial = async (id: number) => {
  const res = await fetch(`/api/material/material/delete?id=${id}`, {
    method: "DELETE",
    body: String(id),
  });
  if (!res.ok) {
    throw new Error("Failed to delete material");
  }
  return res.json();
};


export const columns: ColumnDef<Material>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
    const name = row.getValue("name") as { String: string; Valid: boolean };
    return (
        <div className="capitalize">
        {name.String}
        </div>
        );
    },
    filterFn: (row, columnId, filterValue) => {
      const name = row.getValue(columnId) as { String: string; Valid: boolean };
      return name.String.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div className="">{row.getValue("quantity")}</div>,
    filterFn: (row, columnId, filterValue) => {
      const quantity = row.getValue(columnId) as number;
      return quantity.toString().includes(filterValue);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="">{row.getValue("status")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
    const type = row.getValue("type") as { String: string; Valid: boolean };
    return (
        <div className="">
        {type.String}
        </div>
        );
    },
    filterFn: (row, columnId, filterValue) => {
      const type = row.getValue(columnId) as { String: string; Valid: boolean };
      return type.String.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "job_site",
    header: "Job Site",
    cell: ({ row }) => <div className="">{row.getValue("job_site")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const material = row.original;

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
              onClick={() => navigator.clipboard.writeText(material.status)}
            >
              Copy status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => deleteMaterial(material.id)}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem>Change Quantity</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function MaterialTable() {
  const identity = useContext(IdentityContext);
  const { data: user } = useSWR(identity ? `/api/user/search?id=${identity.id}` : null, fetchUser,)
  const { data, error } = useSWR<Material[]>("/api/material/material/all", fetchMaterial);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!data) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter quantity..."
          value={(table.getColumn("quantity")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("quantity")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter status..."
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("status")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter type..."
          value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("type")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <InitAddFormDialougeAdmin route={user ? `/api/material/material/search?site=${user.jobsite_id.Valid ? user.jobsite_id.Int64 : undefined}` : undefined} materials={data} />
        <CsvDownloadButton className={cn(buttonVariants({variant : 'outline'}))} data={data}><FileSpreadsheet /></CsvDownloadButton>
        <Button variant="outline" size="default" onClick={() => window.print()}>
          <Printer />
        </Button>
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