'use client'

import Link from "next/link";
import styles from "./page.module.css";
import React, { useState } from 'react';

export default function Login() {

  const [inputValue1, setInputValue1] = useState('');
  
  const handleChange1 = (event) => {
    setInputValue1(event.target.value);
  };
  
  const [inputValue2, setInputValue2] = useState('');
  
  const handleChange2 = (event) => {
    setInputValue2(event.target.value);
  };

  const buttonEnable = inputValue1.length > 0 && inputValue2.length > 0;

  return (
    <main className={styles.main}>
        <div className={styles.headerDivLogin1}>Login
        </div>
        <div className={styles.bodyDivLogin1}>
            <div className={styles.bodyDivLogin2}>
                <input type="username" value={inputValue1} onChange={handleChange1} placeholder="Username" className={styles.inputLogin}></input>
            </div>
            <div className={styles.bodyDivLogin2}>
                <input type="password" value={inputValue2} onChange={handleChange2} placeholder="Password" className={styles.inputLogin}></input>
            </div>
            <div className={styles.LoginButtonDiv}>
                <Link href="/home">
                    <button disabled={!buttonEnable} className={styles.buttonLogin}>Login</button>
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