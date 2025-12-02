"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import styles from "./page.module.css";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  artisan: string;
  artisanId: string;
  description: string;
  image: string;
};

const priceFilters = [
  { label: "All prices", min: 0, max: Infinity },
  { label: "Under $75", min: 0, max: 75 },
  { label: "$75 - $150", min: 75, max: 150 },
  { label: "$150+", min: 150, max: Infinity },
];

const newsHighlights = [
  {
    title: "Studio Residency",
    body: "Apply for a summer residency with artist mentors in Oaxaca.",
  },
  {
    title: "Community Pop-up",
    body: "Meet 25 artisans in-person at the Slow Craft Fair this weekend.",
  },
  {
    title: "New Material Guide",
    body: "Learn how to care for hand-dyed textiles to keep colors bright.",
  },
];

const classNames = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?status=published");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = Array.from(
    new Set(products.map((product) => product.category)),
  );

  const filteredProducts = useMemo(() => {
    const priceBounds = priceFilters[selectedPriceIndex];

    return products.filter((product) => {
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artisan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice =
        product.price >= priceBounds.min && product.price <= priceBounds.max;

      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, selectedPriceIndex]);

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  return (
    <div className={styles.catalog}>
      <header className={styles.catalogHeader}>
        <p className={styles.catalogLabel}>Product Catalog</p>
        <div className={styles.catalogHeaderRow}>
          <h1 className={styles.catalogTitle}>Explore handcrafted originals</h1>
          <div className={styles.catalogMeta}>
            {filteredProducts.length} listings · {availableCategories.length}{" "}
            categories
          </div>
        </div>
      </header>

      <div className={styles.catalogGrid}>
        {/* Left sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h2 className={styles.sectionLabel}>Categories</h2>
            <ul className={styles.categoryList}>
              <li>
                <button
                  className={classNames(
                    styles.categoryButton,
                    !selectedCategory && styles.categoryButtonAll,
                  )}
                  onClick={() => setSelectedCategory(null)}
                >
                  All categories
                </button>
              </li>
              {availableCategories.map((category) => (
                <li key={category}>
                  <button
                    className={classNames(
                      styles.categoryButton,
                      selectedCategory === category &&
                        styles.categoryButtonActive,
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sectionLabel}>Price</h3>
            <div className={styles.priceFilters}>
              {priceFilters.map((filter, index) => (
                <label key={filter.label}>
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceIndex === index}
                    onChange={() => setSelectedPriceIndex(index)}
                  />{" "}
                  {filter.label}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Center column */}
        <section className={styles.results}>
          <div className={styles.searchRow}>
            <div className={styles.searchInput}>
              <span className={styles.searchLabel}>Search</span>
              <input
                placeholder="Try ceramics, baskets, or olivewood"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Link href="/search" className={styles.saveSearchButton}>
              Advanced Search
            </Link>
          </div>

          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
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
                  <p className={styles.productDescription}>
                    {product.description}
                  </p>
                </div>
                <div className={styles.productMeta}>
                  <span>${product.price}</span>
                  <Link
                    href={`/profiles/artisan/${encodeURIComponent(product.artisan)}`}
                    className={styles.productArtisan}
                  >
                    {product.artisan}
                  </Link>
                </div>
                <Link
                  href={`/products/${product._id}`}
                  className={styles.productButton}
                >
                  View details
                </Link>
              </article>
            ))}
            {filteredProducts.length === 0 && (
              <div className={styles.emptyState}>
                No listings match your filters yet. Try another combination!
              </div>
            )}
          </div>
        </section>

        {/* Right column */}
        <aside className={styles.newsPanel}>
          <div>
            <h3 className={styles.sectionLabel}>Community news</h3>
            <div className={styles.newsList}>
              {newsHighlights.map((item) => (
                <article key={item.title} className={styles.newsCard}>
                  <h4 className={styles.newsTitle}>{item.title}</h4>
                  <p className={styles.newsBody}>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.becomeArtisan}>
            <h3 className={styles.becomeTitle}>Become an Artisan</h3>
            <p className={styles.becomeBody}>
              Launch your shop, publish lookbooks, and manage commissions with
              secure payouts.
            </p>
            <Link href="/auth/signup" className={styles.becomeLink}>
              Start onboarding
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
