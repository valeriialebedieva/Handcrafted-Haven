import styles from "./page.module.css";

const sampleReviews = [
  {
    product: "Clay Stories Vase",
    reviewer: "Anika R.",
    rating: 5,
    comment: "Arrived perfectly packaged and the glaze is even richer in person!",
  },
  {
    product: "Olivewood Board",
    reviewer: "Theo L.",
    rating: 4,
    comment: "Beautiful patterning. Would love an option for a larger size.",
  },
];

export default function ReviewsPage() {
  return (
    <div className={styles.reviews}>
      <section className={styles.intro}>
        <h1 className={styles.introTitle}>Reviews & ratings</h1>
        <p className={styles.introBody}>
          Collect feedback on every listing, showcase testimonials on product
          pages, and help customers make confident purchasing decisions.
        </p>
      </section>
      <section className={styles.grid}>
        {sampleReviews.map((review) => (
          <article key={review.product} className={styles.card}>
            <div className={styles.cardHeader}>
              <span>
                {review.product} · {review.reviewer}
              </span>
              <span className={styles.stars}>{"★".repeat(review.rating)}</span>
            </div>
            <p className={styles.cardBody}>{review.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

