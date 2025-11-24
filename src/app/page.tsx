import Link from "next/link";
import styles from "./page.module.css";

const highlights = [
  {
    title: "Shop One-of-a-kind Finds",
    body: "Discover hand-carved bowls, botanical dyes, and limited collections from artisans across the globe.",
  },
  {
    title: "Meet the Makers",
    body: "Follow artisan profiles, learn their process, and request bespoke pieces straight from their studios.",
  },
  {
    title: "Celebrate Slow Craft",
    body: "Browse curated themes each week—earthy tablescapes, cozy textiles, or bold statement jewelry.",
  },
];

const featuredCategories = [
  { name: "Jewelry", count: 42 },
  { name: "Ceramics", count: 35 },
  { name: "Textiles", count: 28 },
  { name: "Woodwork", count: 18 },
];

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <p className={styles.heroHeading}>Handcrafted Haven</p>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              A curated marketplace for soulful objects and the artists who make
              them.
            </h1>
            <p className={styles.heroDescription}>
              Build your dream collection by supporting independent artisans.
              Track commissions, follow studios you love, and connect with a
              community that values the handmade.
            </p>
            <div className={styles.heroActions}>
              <Link href="/products" className={styles.primaryButton}>
                Browse the catalog
              </Link>
              <Link href="/profiles" className={styles.secondaryButton}>
                Meet featured artisans
              </Link>
            </div>
          </div>
          <div className={styles.heroHighlight}>
            <p className={styles.highlightSubtitle}>Weekly Drop</p>
            <h2 className={styles.highlightTitle}>
              Clay Stories by Solis Studio
            </h2>
            <p className={styles.highlightDescription}>
              12 sculptural vessels inspired by desert botanicals. Each piece is
              signed, fired using solar kilns, and ships with a certificate of
              authenticity.
            </p>
            <div className={styles.highlightMeta}>
              <span>12 pieces</span>
              <span aria-hidden="true">•</span>
              <span>Ships worldwide</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.twoColumn}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Explore by category</h3>
            <Link href="/products" className={styles.cardLink}>
              View all
            </Link>
          </div>
          <ul className={styles.categoryList}>
            {featuredCategories.map((category) => (
              <li key={category.name} className={styles.categoryItem}>
                <span>{category.name}</span>
                <span className={styles.categoryCount}>
                  {category.count} listings
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>What makes us different</h3>
          <div className={styles.highlightList}>
            {highlights.map((item) => (
              <article key={item.title} className={styles.highlightCard}>
                <h4 className={styles.highlightCardTitle}>{item.title}</h4>
                <p className={styles.highlightCardBody}>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <div className={styles.spotlightGrid}>
          <div className={styles.spotlightDetails}>
            <p className={styles.spotlightLabel}>Artisan spotlight</p>
            <h3 className={styles.spotlightTitle}>
              The Santos Textile Cooperative
            </h3>
            <p className={styles.spotlightBody}>
              A fourth-generation weaving collective in Oaxaca using natural
              cochineal dyes. Follow their process, reserve limited drops, and
              commission your own heirloom rugs.
            </p>
            <div className={styles.spotlightTags}>
              <span className={styles.spotlightTagClay}>8 master weavers</span>
              <span className={styles.spotlightTagOlive}>
                Climate-positive studio
              </span>
            </div>
          </div>
          <div className={styles.workshopCard}>
            <p className={styles.workshopLabel}>Upcoming workshop</p>
            <h4 className={styles.workshopTitle}>Alive with Texture</h4>
            <p className={styles.workshopBody}>
              Join live studio sessions to learn traditional warp techniques,
              plant-based dye tutorials, and mindful sourcing practices.
            </p>
            <button className={styles.workshopButton}>Reserve a seat</button>
          </div>
        </div>
      </section>
    </div>
  );
}
