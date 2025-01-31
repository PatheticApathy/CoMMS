'use client'

import Link from "next/link";
import styles from "./page.module.css";
import React, { useState } from 'react';


export default function Signup() {

    const user = ref<Signup>()

    const [inputValue1, setInputValue1] = useState('');
    const [isValid1, setIsValid1] = useState(true)
  
    const handleChange1 = (event) => {
      const value = event.target.value
      setInputValue1(value);
  
      const isAlphaNumeric = /^[a-zA-Z0-9@.]+$/.test(value);
      setIsValid1(isAlphaNumeric);
    };

    const [inputValue2, setInputValue2] = useState('');
    const [isValid2, setIsValid2] = useState(true)
  
    const handleChange2 = (event) => {
      const value = event.target.value
      setInputValue2(value);
  
      const isNumeric = /^[0-9]+$/.test(value);
      setIsValid2(isNumeric);
    };

  const [inputValue3, setInputValue3] = useState('');
  const [isValid3, setIsValid3] = useState(true)

  const handleChange3 = (event) => {
    const value = event.target.value
    setInputValue3(value);

    const isAlphaNumeric = /^[a-zA-Z0-9]+$/.test(value);
    setIsValid3(isAlphaNumeric);
  };

  const [inputValue4, setInputValue4] = useState('');

  const handleChange4 = (event) => {
    setInputValue4(event.target.value);
  };

  const [inputValue5, setInputValue5] = useState('');

  const handleChange5 = (event) => {
    setInputValue5(event.target.value);
  };

  const buttonEnable = inputValue1.length > 0 && inputValue2.length > 0 && inputValue3.length > 0 
  && inputValue4.length > 0 && inputValue5.length > 0 && isValid1 && isValid2 && isValid3 
  && inputValue4 === inputValue5;

  return (
    <main className={styles.main}>
        <div className={styles.headerDivLogin1}>Sign Up
        </div>
        <div className={styles.bodyDivLogin1}>
            <div className={styles.bodyDivLogin2}>
                <input type="email" value={inputValue1} onChange={handleChange1} placeholder="Email" className={styles.inputLogin}></input>
            </div>
            <div className={styles.bodyDivLogin2}>
                <input type="phoneNumber" value={inputValue2} onChange={handleChange2} placeholder="Phone Number" className={styles.inputLogin}></input>
            </div>
            <div className={styles.bodyDivLogin2}>
                <input type="username" value={inputValue3} onChange={handleChange3} placeholder="Username" className={styles.inputLogin}></input>
            </div>
            <div className={styles.bodyDivLogin2}>
                <input type="password" value={inputValue4} onChange={handleChange4} placeholder="Password" className={styles.inputLogin}></input>
            </div>
            <div className={styles.bodyDivLogin2}>
                <input type="password" value={inputValue5} onChange={handleChange5} placeholder="Confirm Password" className={styles.inputLogin}></input>
            </div>
            <div className={styles.LoginButtonDiv}>
                <Link href="/home">
                    <button disabled={!buttonEnable} className={styles.buttonLogin}>Sign Up</button>
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