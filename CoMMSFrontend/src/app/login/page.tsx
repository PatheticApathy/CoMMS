import Link from "next/link";
import styles from "./page.module.css";

export default function Jobs() {
  return (
    <main className={styles.main}>
        <div className={styles.headerDivLogin1}>Login
        </div>
        <div className={styles.bodyDivLogin1}>
            <div className={styles.bodyDivLogin2}>
                <input type="username" placeholder="Username" className={styles.inputLogin}></input>
            </div>
            <div className={styles.bodyDivLogin2}>
                <input type="password" placeholder="Password" className={styles.inputLogin}></input>
            </div>
            <div className={styles.LoginButtonDiv}>
                <Link href="/home">
                    <button className={styles.buttonLogin}>Login</button>
                </Link>
            </div>
            <div className={styles.LoginToSignupDiv1}>Don't Have an Account?
                <div>
                    <Link href="/signup">
                        <div className={styles.LoginToSignupDiv2}>Sign up!</div>
                    </Link>
                </div>
            </div>
        </div>
    </main>
  );
}