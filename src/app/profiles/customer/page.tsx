"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Order {
  _id: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
}

interface Review {
  _id: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userResponse = await fetch("/api/auth/me");
      if (!userResponse.ok) {
        router.push("/auth/login");
        return;
      }

      const userData = await userResponse.json();
      setUser(userData.user);

      // Fetch customer orders
      const ordersResponse = await fetch(`/api/customers/${userData.user.id}/orders`);
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

      // Fetch customer reviews
      const reviewsResponse = await fetch(`/api/customers/${userData.user.id}/reviews`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.customerProfile}>
      <header className={styles.profileHeader}>
        <h1 className={styles.profileName}>My Profile</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>

      <section className={styles.profileInfo}>
        <h2>Account Information</h2>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Name:</span>
          <span className={styles.infoValue}>{user.name}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email:</span>
          <span className={styles.infoValue}>{user.email}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Role:</span>
          <span className={styles.infoValue}>{user.role}</span>
        </div>
      </section>

      <section className={styles.ordersSection}>
        <h2>My Orders</h2>
        {orders.length > 0 ? (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <article key={order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderId}>Order #{order._id.slice(-6)}</span>
                  <span className={styles.orderStatus}>{order.status}</span>
                </div>
                <div className={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className={styles.orderItems}>
                  {order.products.map((item, idx) => (
                    <div key={idx} className={styles.orderItem}>
                      <span>{item.productName}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.orderTotal}>Total: ${order.total}</div>
              </article>
            ))}
          </div>
        ) : (
          <p>No orders yet.</p>
        )}
      </section>

      <section className={styles.reviewsSection}>
        <h2>My Reviews</h2>
        {reviews.length > 0 ? (
          <div className={styles.reviewsList}>
            {reviews.map((review) => (
              <article key={review._id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewProduct}>{review.productName}</span>
                  <span className={styles.reviewStars}>
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
                <div className={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No reviews yet.</p>
        )}
      </section>
    </div>
  );
}

