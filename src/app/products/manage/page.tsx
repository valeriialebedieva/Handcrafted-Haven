"use client";

import styles from "./page.module.css";

export default function ManageProductsPage() {
  return (
    <div className={styles.manage}>
      <section className={styles.intro}>
        <h1 className={styles.introTitle}>Product manager</h1>
        <p className={styles.introBody}>
          Draft, edit, and publish handcrafted listings with pricing, imagery,
          and storytelling fields tailored to artisans.
        </p>
      </section>
      <form className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>Product name</span>
          <input className={styles.input} placeholder="Terracotta tea set" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Price (USD)</span>
          <input className={styles.input} type="number" placeholder="120" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Category</span>
          <input className={styles.input} placeholder="Ceramics" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Image URL</span>
          <input className={styles.input} placeholder="https://..." />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Description</span>
          <textarea
            className={styles.textarea}
            placeholder="Share the inspiration, materials, and process..."
          />
        </label>
        <div className={styles.actions}>
          <button type="submit" className={styles.primary}>
            Publish listing
          </button>
          <button type="button" className={styles.secondary}>
            Save draft
          </button>
          <button type="button" className={styles.secondary}>
            Delete listing
          </button>
        </div>
      </form>
    </div>
  );
}

