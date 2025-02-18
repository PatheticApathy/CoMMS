'use server'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function JobsitesCore() {
    return (
    <div className="flex flex-col gap-5">
        <Link href="/jobsite">
            <Button variant="secondary">Jobsite 1</Button>
        </Link>
        <Link href="/jobsites">
            <Button variant="secondary">Jobsite 2</Button>
        </Link>
        <Link href="/jobsites">
            <Button variant="secondary">etcetera...</Button>
        </Link>
    </div>
    )
}
