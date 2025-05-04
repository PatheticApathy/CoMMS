import { User, Company, JobSite } from "@/user-api-types";
import { useState } from "react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import { mutate } from "swr";
import { toast } from "sonner";
import { getToken } from "./identity-provider";

const updateUser = async (id: number, field: string, value: { String: string; Valid: boolean } | { Int64: number; Valid: boolean }) => {
  const res = await fetch(`/api/user/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: getToken() || "bruh",
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
    headers: { authorization: getToken() || "bruh" },
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
  return res.json();
};

export default function AdminDropDown({ user, jobsites, companies }: { user: User; jobsites: JobSite[]; companies: Company[] }) {
  const [newCompany, setNewCompany] = useState("");
  const [newJobsite, setNewJobsite] = useState("");
  const [newRole, setNewRole] = useState("");

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const company = companies?.find((c) => c.name.toLowerCase() === newCompany.toLowerCase());
    if (company) {
      await updateUser(user.id, "company_id", { Int64: company.id, Valid: true });
      toast.success("Company updated successfully");
      mutate("/api/user/join");
    } else {
      toast.error("Company not found");
    }
  };

  const handleUpdateJobsite = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobsite = jobsites?.find((j) => j.name.toLowerCase() === newJobsite.toLowerCase());
    if (jobsite) {
      await updateUser(user.id, "jobsite_id", { Int64: jobsite.id, Valid: true });
      toast.success("Jobsite updated successfully");
      mutate("/api/user/join");
    } else {
      toast.error("Jobsite not found");
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole) {
      await updateUser(user.id, "role", { String: newRole, Valid: true });
      toast.success("Role updated successfully");
      mutate("/api/user/join");
    } else {
      toast.error("Role can only be admin or user");
    }
  };

  const handleDeleteUser = async () => {
    await deleteUser(user.id);
    toast.success("User deleted successfully");
    mutate("/api/user/join");
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
        <DropdownMenuLabel className="text-surface">Actions</DropdownMenuLabel>
        <DropdownMenuItem className="text-surface" onClick={() => navigator.clipboard.writeText(user.id.toString())}>
          Copy id #
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-surface" onClick={handleDeleteUser}>
          Delete user
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
          <Input
            placeholder="New Company"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="yellow" onClick={handleUpdateCompany}>
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
          <Button variant="yellow" onClick={handleUpdateJobsite}>
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
          <Button variant="yellow" onClick={handleUpdateRole}>
            Change role
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}