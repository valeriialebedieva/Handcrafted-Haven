import styles from "./page.module.css";

const panels = [
  {
    title: "Artisan workspace",
    body: "Secure area where makers manage inventory, fulfillment, and payout details.",
  },
  {
    title: "Customer portal",
    body: "View orders, request returns, and download invoices without touching artisan tooling.",
  },
  {
    title: "Role-based access",
    body: "Route guards ensure artisans control products while customers see read-only states.",
  },
  {
    title: "Audit trail",
    body: "Every action is logged so we can sync with MongoDB and keep moderation transparent.",
  },
];

export default function DashboardPage() {
  return (
    <div className={styles.dashboard}>
      <section className={styles.intro}>
        <h1 className={styles.introTitle}>Secure dashboard</h1>
        <p className={styles.introBody}>
          This route illustrates where role-protected flows will live once
          authentication is wired up. Artisans and customers will see different
          panels depending on their permissions.
        </p>
      </section>
      <section className={styles.grid}>
        {panels.map((panel) => (
          <article key={panel.title} className={styles.card}>
            <h2 className={styles.cardTitle}>{panel.title}</h2>
            <p className={styles.cardBody}>{panel.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

