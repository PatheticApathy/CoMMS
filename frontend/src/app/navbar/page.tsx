import Link from "next/link";
import styles from "./page.module.css";

    export default function Navbar() {
    return (
        <div className={styles.full}>

            <div className={styles.leftNavBarDiv1}>
            <nav className={styles.leftNavBarNav} aria-label="Primary" role="Navigation">
                <Link href="/home">
                    <div className={styles.leftNavBarDiv2}>
                        <div className={styles.leftNavBarDiv3}>
                        </div>
                        <div className={styles.leftNavBarDiv4}>
                        </div>Home
                    </div>
                </Link>
            </nav>
            <nav className={styles.leftNavBarNav} aria-label="Primary" role="Navigation">
                <Link href="/jobs">
                    <div className={styles.leftNavBarDiv2}>
                        <div className={styles.leftNavBarDiv3}>
                        </div>
                        <div className={styles.leftNavBarDiv4}>
                        </div>Jobs
                    </div>
                </Link>
            </nav>
            </div>

        </div>
    );
    }