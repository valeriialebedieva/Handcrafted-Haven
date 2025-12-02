"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  artisan: string;
  description: string;
  image: string;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [artisan, setArtisan] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    performSearch();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/search");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.filters?.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (artisan) params.append("artisan", artisan);

      const response = await fetch(`/api/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className={styles.searchPage}>
      <section className={styles.intro}>
        <h1 className={styles.introTitle}>Search & filter hub</h1>
        <p className={styles.introBody}>
          Quickly discover handcrafted items by combining keyword search,
          category tags, and price sliders. This page mirrors the experience we
          surface inside the catalog but in a dedicated route for sharing saved
          filters.
        </p>
      </section>
      <form onSubmit={handleSubmit} className={styles.panel}>
        <div className={styles.filterRow}>
          <input
            className={styles.input}
            placeholder="Search by name or artisan"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.rangeGroup}>
          <input
            className={styles.input}
            placeholder="Min price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
          <input
            className={styles.input}
            placeholder="Max price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />
        </div>
        <div className={styles.filterRow}>
          <input
            className={styles.input}
            placeholder="Search by artisan name"
            value={artisan}
            onChange={(e) => setArtisan(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.searchButton} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
        <div className={styles.tagList}>
          <span className={styles.tag}>Sustainable</span>
          <span className={styles.tag}>Small batch</span>
          <span className={styles.tag}>Ready to ship</span>
        </div>
      </form>

      <section className={styles.results}>
        <h2>Search Results ({products.length})</h2>
        {loading ? (
          <p>Searching...</p>
        ) : products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <article key={product._id} className={styles.productCard}>
                <div className={styles.productThumb}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    product.category
                  )}
                </div>
                <div className={styles.productDetails}>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <p className={styles.productDescription}>{product.description}</p>
                </div>
                <div className={styles.productMeta}>
                  <span>${product.price}</span>
                  <span className={styles.productArtisan}>{product.artisan}</span>
                </div>
                <Link
                  href={`/products/${product._id}`}
                  className={styles.productButton}
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p>No products found. Try adjusting your filters.</p>
        )}
      </section>
    </div>
  );
}
