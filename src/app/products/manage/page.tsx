"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Product {
  _id?: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  status: "draft" | "published";
}

export default function ManageProductsPage() {
  const router = useRouter();
  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    category: "",
    description: "",
    image: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        if (data.user.role === "artisan") {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          router.push("/");
        }
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      router.push("/auth/login");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent, status: "draft" | "published") => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...product, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create product");
        setLoading(false);
        return;
      }

      setSuccess(
        status === "published"
          ? "Product published successfully!"
          : "Product saved as draft!"
      );
      setProduct({
        name: "",
        price: 0,
        category: "",
        description: "",
        image: "",
        status: "draft",
      });
      setLoading(false);

      setTimeout(() => {
        router.push("/products");
      }, 1500);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className={styles.loading}>Checking authentication...</div>;
  }

  return (
    <div className={styles.manage}>
      <section className={styles.intro}>
        <h1 className={styles.introTitle}>Product manager</h1>
        <p className={styles.introBody}>
          Draft, edit, and publish handcrafted listings with pricing, imagery,
          and storytelling fields tailored to artisans.
        </p>
      </section>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      <form
        className={styles.form}
        onSubmit={(e) => handleSubmit(e, "published")}
      >
        <label className={styles.field}>
          <span className={styles.label}>Product name</span>
          <input
            className={styles.input}
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Terracotta tea set"
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Price (USD)</span>
          <input
            className={styles.input}
            name="price"
            type="number"
            value={product.price || ""}
            onChange={handleChange}
            placeholder="120"
            min="0"
            step="0.01"
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Category</span>
          <input
            className={styles.input}
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Ceramics"
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Image URL</span>
          <input
            className={styles.input}
            name="image"
            type="url"
            value={product.image}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Description</span>
          <textarea
            className={styles.textarea}
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Share the inspiration, materials, and process..."
            required
          />
        </label>
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.primary}
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish listing"}
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={(e) => handleSubmit(e, "draft")}
            disabled={loading}
          >
            Save draft
          </button>
        </div>
      </form>
    </div>
  );
}
