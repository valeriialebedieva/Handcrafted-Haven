"use client";

import styles from "./page.module.css";

export default function SearchPage() {
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
      <section className={styles.panel}>
        <div className={styles.filterRow}>
          <input className={styles.input} placeholder="Search by name or artisan" />
          <input className={styles.input} placeholder="Category (e.g. jewelry)" />
        </div>
        <div className={styles.rangeGroup}>
          <input className={styles.input} placeholder="Min price" type="number" />
          <input className={styles.input} placeholder="Max price" type="number" />
        </div>
        <div className={styles.tagList}>
          <span className={styles.tag}>Sustainable</span>
          <span className={styles.tag}>Small batch</span>
          <span className={styles.tag}>Ready to ship</span>
        </div>
      </section>
    </div>
  );
}

