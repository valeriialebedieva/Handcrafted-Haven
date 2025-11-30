"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../auth.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"artisan" | "customer">("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (data.user.role === "artisan") {
        router.push("/dashboard");
      } else {
        router.push("/profiles/customer");
      }
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Join the community</h1>
        <p className={styles.subtitle}>
          Create an account to publish products, follow artisans, and track orders.
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div style={{ color: "#B65C3A", marginBottom: "1rem" }}>{error}</div>}
        <label className={styles.field}>
          <span className={styles.label}>Full name</span>
          <input
            type="text"
            className={styles.input}
            placeholder="Carmen Alvarez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            type="email"
            className={styles.input}
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <input
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Account type</span>
          <select
            className={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value as "artisan" | "customer")}
            required
          >
            <option value="customer">Customer</option>
            <option value="artisan">Artisan</option>
          </select>
        </label>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
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
