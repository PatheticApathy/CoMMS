import Link from "next/link";

import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Welcome() {
  return (
    <main>
      <div className="h-screen bg-commColor1">
        <Image alt="logo" className="absolute" src="/LogoSquare.png" width={250} height={250}/>
        <div className="flex flex-col text-center justify-center">
          <h1 className="font-bold text-6xl pt-20 justify-center self-center">Welcome to CoMMS</h1>
          <h2 className="text-3xl pt-10">The Construction Material Management Software</h2>
        </div>
        <div className="pt-28">
          <div className="flex flex-col text-center items-center">
            <p className="text-pretty text-xl max-w-2xl">
              The Construction Material Management System, or CoMMS, is a system through which employees of construction
              companies, or companies in fields that require similar material tracking, can keep track of materials throughout a job site. This system
              is designed to be used through this website for easy accessibility.
            </p>
            <div className="w-1/2 pt-20 justify-self-center">
              <Link href="/login">
                <Button variant="yellow">Go To Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
