"use client";

import Link from "next/link";
import styles from "../auth.module.css";

export default function LoginPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>
          Sign in to manage commissions, purchases, and saved artisans.
        </p>
      </div>
      <form className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input type="email" className={styles.input} placeholder="you@email.com" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <input type="password" className={styles.input} placeholder="••••••••" />
        </label>
        <button type="submit" className={styles.submit}>
          Login
        </button>
      </form>
      <p className={styles.switch}>
        New to Handcrafted Haven?{" "}
        <Link href="/auth/signup" className={styles.switchLink}>
          Create an account
        </Link>
      </p>
    </div>
  );
}

