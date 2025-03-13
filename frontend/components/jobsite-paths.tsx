'use server'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function JobsitePaths() {
    return (
    <div className="flex flex-col gap-5">
        <Link href="http://localhost:3000/dashboard/material/jobsite/1">
            <Button variant="secondary">Materials</Button>
        </Link>
        <Link href="http://localhost:3000/dashboard/contacts">
            <Button variant="secondary">Contacts</Button>
        </Link>
    </div>
    )
}
