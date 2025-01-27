import styles from "./page.module.css";
import Link from "next/link";

export default function Welcome() {
  return (
    <main className={styles.main}>
      <div className={styles.headerDivWelcome1}>Welcome to CoMMS
        <div className={styles.headerDivWelcome2}>The Construction Material Management System</div>
      </div>
      <div className={styles.bodyDivWelcome1}>
        <div className={styles.bodyDivWelcome2}>The Construction Material Management System, or CoMMS, is a system through which employees of construction
          companies, or companies in fields that require similar material tracking, can keep track of materials throughout a job site. This system
          is designed to be used through this website for easy accessibility.
        </div>
        <div className={styles.WelcomeButtonDiv}>
          <Link href="/home">
            <button className={styles.buttonWelcome}>Go To Home</button>
          </Link>
        </div>
      </div>
    </main>
  );
}