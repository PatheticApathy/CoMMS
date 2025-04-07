import { User, Company, JobSite } from "@/user-api-types";
import { useState } from "react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import { mutate } from "swr";
import { toast } from "sonner";

const updateUser = async (id: number, field: string, value: { String: string; Valid: boolean } | { Int64: number; Valid: boolean }) => {
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

const deleteUser = async (id: number) => {
  const res = await fetch(`/api/user/delete?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
  return res.json();
};

export default function AdminDropDown({ user, jobsites, companies }: { user: User, jobsites: JobSite[], companies: Company[] }) {
  const [newCompany, setNewCompany] = useState("");
  const [newJobsite, setNewJobsite] = useState("");
  const [newRole, setNewRole] = useState("");


  const handleUpdateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const company = companies?.find(c => c.name.toLowerCase() === newCompany.toLowerCase());
    if (company) {
      updateUser(user.id, "company_id", { Int64: company.id, Valid: true });
      mutate('/api/company/all')
    } else {
      toast.error("Company not found");
    }
  };

  const handleUpdateJobsite = (e: React.FormEvent) => {
    e.preventDefault();
    const jobsite = jobsites?.find(j => j.name.toLowerCase() === newJobsite.toLowerCase());
    if (jobsite) {
      updateUser(user.id, "jobsite_id", { Int64: jobsite.id, Valid: true });
    } else {
      toast.error("Jobsite not found");
    }
  };

  return (
    <DropdownMenuLabel>
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
          <Button onClick={(e) => { e.preventDefault(); updateUser(user.id, "role", { String: newRole, Valid: true }); }}>
            Change role
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuLabel>
  );

}
