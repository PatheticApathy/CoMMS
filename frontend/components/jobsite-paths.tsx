
'use server'
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function JobsitePaths() {
    return (
    <div className="flex flex-col gap-5">
        <Link href="/materials">
            <Button variant="secondary">Materials</Button>
        </Link>
        <Link href="/contacts">
            <Button variant="secondary">Contacts</Button>
        </Link>
    </div>
    )
}
