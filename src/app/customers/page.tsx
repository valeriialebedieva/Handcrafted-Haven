import styles from "./page.module.css";

const customerHighlights = [
  {
    title: "Profile overview",
    body: "View saved addresses, artisan follows, and wishlist alerts.",
  },
  {
    title: "Order history",
    body: "Track deliveries, download receipts, and request artisan support.",
  },
  {
    title: "Reviews & notes",
    body: "Edit published reviews and keep private notes for future buys.",
  },
];

export default function CustomersPage() {
  return (
    <div className={styles.customers}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Customer portal</h1>
        <p className={styles.heroBody}>
          A dedicated space for buyers to review their purchases, manage saved
          artisans, and share feedback with the community.
        </p>
      </section>
      <section className={styles.grid}>
        {customerHighlights.map((item) => (
          <article key={item.title} className={styles.card}>
            <h2 className={styles.cardTitle}>{item.title}</h2>
            <p className={styles.cardBody}>{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

