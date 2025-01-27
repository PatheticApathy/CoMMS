import Link from "next/link";
import styles from "./page.module.css";

export default function Jobs() {
  return (
    <main className={styles.main}>
        <div className={styles.headerDivLogin1}>Sign Up
        </div>
        <div className={styles.bodyDivLogin1}>
            <div className={styles.bodyDivLogin2}>
                <input type="email" placeholder="Email" className={styles.inputLogin}></input>
            </div>
            <div className={styles.bodyDivLogin2}>
                <input type="phoneNumber" placeholder="Phone Number" className={styles.inputLogin}></input>
            </div>
            <div className={styles.bodyDivLogin2}>
                <input type="username" placeholder="Username" className={styles.inputLogin}></input>
            </div>
            <div className={styles.bodyDivLogin2}>
                <input type="password" placeholder="Password" className={styles.inputLogin}></input>
            </div>
            <div className={styles.LoginButtonDiv}>
                <Link href="/home">
                    <button className={styles.buttonLogin}>Sign Up</button>
                </Link>
            </div>
            <div className={styles.LoginToSignupDiv1}>Already Have an Account?
                <div>
                    <Link href="/login">
                        <div className={styles.LoginToSignupDiv2}>Log in!</div>
                    </Link>
                </div>
            </div>
        </div>
    </main>
  );
}