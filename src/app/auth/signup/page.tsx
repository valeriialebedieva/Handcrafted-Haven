"use client";

import Link from "next/link";
import styles from "../auth.module.css";

export default function SignupPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Join the community</h1>
        <p className={styles.subtitle}>
          Create an account to publish products, follow artisans, and track orders.
        </p>
      </div>
      <form className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Full name</span>
          <input type="text" className={styles.input} placeholder="Carmen Alvarez" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input type="email" className={styles.input} placeholder="you@email.com" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <input type="password" className={styles.input} placeholder="••••••••" />
        </label>
        <button type="submit" className={styles.submit}>
          Create account
        </button>
      </form>
      <p className={styles.switch}>
        Already registered?{" "}
        <Link href="/auth/login" className={styles.switchLink}>
          Log in instead
        </Link>
      </p>
    </div>
  );
}

