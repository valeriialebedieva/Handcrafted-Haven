"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  artisan: string;
  artisanId: string;
  description: string;
  image: string;
  createdAt: string;
}

interface Review {
  _id: string;
  reviewer: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    checkAuth();
  }, [productId]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      // User not logged in
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          productName: product?.name || "",
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (response.ok) {
        setReviewComment("");
        setReviewRating(5);
        setShowReviewForm(false);
        fetchReviews();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to submit review");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!product) {
    return <div className={styles.error}>Product not found</div>;
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className={styles.productDetail}>
      <div className={styles.productMain}>
        <div className={styles.productImage}>
          <img src={product.image || "/placeholder.svg"} alt={product.name} />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.productMeta}>
            <span className={styles.category}>{product.category}</span>
            <Link
              href={`/profiles/artisan/${encodeURIComponent(product.artisan)}`}
              className={styles.artisanLink}
            >
              by {product.artisan}
            </Link>
          </div>
          <div className={styles.price}>${product.price}</div>
          <p className={styles.description}>{product.description}</p>
          <button className={styles.addToCartButton}>Add to Cart</button>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2>Reviews</h2>
          {averageRating > 0 && (
            <div className={styles.averageRating}>
              <span className={styles.stars}>
                {"★".repeat(Math.round(averageRating))}
              </span>
              <span className={styles.ratingNumber}>
                {averageRating.toFixed(1)} ({reviews.length})
              </span>
            </div>
          )}
        </div>

        {user && user.role === "customer" && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className={styles.writeReviewButton}
          >
            Write a Review
          </button>
        )}

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
            <h3>Write a Review</h3>
            <div className={styles.ratingInput}>
              <label>Rating:</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                required
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Very Poor</option>
              </select>
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience with this product..."
              required
              rows={5}
            />
            <div className={styles.reviewFormActions}>
              <button type="submit" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewComment("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={styles.reviewsList}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <article key={review._id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewerName}>{review.reviewer}</span>
                  <span className={styles.reviewStars}>
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
                <div className={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </article>
            ))
          ) : (
            <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
}

