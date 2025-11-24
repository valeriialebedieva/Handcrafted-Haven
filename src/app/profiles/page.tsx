import styles from "./page.module.css";

const featuredArtisans = [
  {
    name: "Luna Atelier",
    location: "Lisbon, Portugal",
    specialty: "Sculptural brass jewelry",
    story:
      "Exploring soft geometric silhouettes inspired by ocean tides and moon cycles.",
  },
  {
    name: "Santos Collective",
    location: "Oaxaca, Mexico",
    specialty: "Handwoven textiles",
    story:
      "Fourth-generation weavers using cochineal dyes and solar-powered looms.",
  },
  {
    name: "Valle Kilns",
    location: "Taos, New Mexico",
    specialty: "Minimal ceramics",
    story:
      "Small-batch clay vessels focused on ritual and grounded living spaces.",
  },
];

export default function ArtisansPage() {
  return (
    <div className={styles.artisans}>
      <header className={styles.intro}>
        <p className={styles.introLabel}>Featured profiles</p>
        <h1 className={styles.introTitle}>
          Meet the makers behind the marketplace
        </h1>
        <p className={styles.introBody}>
          Each artisan shares their studio process, sourcing ethos, and new
          product drops so you can follow along and support their craft.
        </p>
      </header>

      <section className={styles.cards}>
        {featuredArtisans.map((artisan) => (
          <article key={artisan.name} className={styles.card}>
            <h2 className={styles.cardName}>{artisan.name}</h2>
            <p className={styles.cardLocation}>{artisan.location}</p>
            <p className={styles.cardSpecialty}>{artisan.specialty}</p>
            <p className={styles.cardStory}>{artisan.story}</p>
            <div className={styles.cardTags}>
              <span className={styles.tag}>Commissions open</span>
              <span className={styles.tag}>Ships worldwide</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

