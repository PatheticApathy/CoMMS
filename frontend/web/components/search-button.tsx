"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchProps {
  onSearch: (query: string) => void;
}

export default function InputWithButton({ onSearch }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input 
        type="search" 
        placeholder="Search" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button variant="yellow" onClick={() => onSearch(searchQuery)}>Search</Button>
    </div>
  );
}
