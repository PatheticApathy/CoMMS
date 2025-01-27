import styles from "./page.module.css";
import Link from "next/link";
import NavBar from "../navbar/page"

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.headerDivHome1}>
        CoMMS
      </div>
      <NavBar />
    </main>
  );
}
