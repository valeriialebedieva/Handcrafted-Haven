"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Review {
  _id: string;
  productId: string;
  productName: string;
  reviewer: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading reviews...</div>;
  }

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
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <article key={review._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <Link href={`/products/${review.productId}`}>
                  <span>
                    {review.productName} · {review.reviewer}
                  </span>
                </Link>
                <span className={styles.stars}>{"★".repeat(review.rating)}</span>
              </div>
              <p className={styles.cardBody}>{review.comment}</p>
              <div className={styles.cardFooter}>
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </article>
          ))
        ) : (
          <p className={styles.noReviews}>No reviews yet. Be the first to review a product!</p>
        )}
      </section>
    </div>
  );
}
