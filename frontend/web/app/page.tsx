import styles from "./page.module.css";
import Link from "next/link";

import { Button } from "@/components/ui/button"

export default function Welcome() {
  return (
    <main className={styles.main}>
      <div className="h-screen">
        <div className="flex flex-col text-center justify-center">
          <h1 className="font-bold text-6xl pt-40 justify-end">Welcome to CoMMS</h1>
          <h2 className="text-3xl pt-10">The Construction Material Management System</h2>
        </div>
        <div className="pt-28">
          <div className="justify-center">
            <p className="text-pretty text-center text-xl">
              The Construction Material Management System, or CoMMS, is a system through which employees of construction
              companies, or companies in fields that require similar material tracking, can keep track of materials throughout a job site. This system
              is designed to be used through this website for easy accessibility.
            </p>
            <div className="pt-32 justify-self-center">
              <Link href="/login">
                <Button>Go To Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
