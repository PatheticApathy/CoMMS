import styles from "./page.module.css";
import Link from "next/link";
import NavBar from "../navbar/page"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function Jobs() {
  return (
    <main className={styles.main}>
      <div className={styles.headerDivJobs1}>Jobs
      </div>
      <NavBar />
    </main>
  );
}