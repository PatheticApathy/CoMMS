import styles from "./page.module.css";
import Link from "next/link";
import NavBar from "../navbar/page"

export default function Jobs() {
  return (
    <main className={styles.main}>
      <div className={styles.headerDivJobs1}>Jobs
      </div>
      <NavBar />
    </main>
  );
}