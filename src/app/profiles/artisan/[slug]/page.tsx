import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

async function getArtisanProfile(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/profiles/artisan/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching artisan profile:", error);
    return null;
  }
}

export default async function ArtisanProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getArtisanProfile(slug);

  if (!data) {
    notFound();
  }

  const { profile, products } = data;
  const artisanProfile = profile.artisanProfile || {};

  return (
    <div className={styles.artisanProfile}>
      <header className={styles.profileHeader}>
        <h1 className={styles.profileName}>
          {artisanProfile.studioName || profile.name}
        </h1>
        {artisanProfile.location && (
          <p className={styles.profileLocation}>{artisanProfile.location}</p>
        )}
        {artisanProfile.specialty && (
          <p className={styles.profileSpecialty}>{artisanProfile.specialty}</p>
        )}
      </header>

      {artisanProfile.story && (
        <section className={styles.profileStory}>
          <h2>Our Story</h2>
          <p>{artisanProfile.story}</p>
        </section>
      )}

      {artisanProfile.tags && artisanProfile.tags.length > 0 && (
        <div className={styles.cardTags}>
          {artisanProfile.tags.map((tag: string) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>Products</h2>
        {products && products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map((product: any) => (
              <article key={product._id} className={styles.productCard}>
                <div className={styles.productThumb}>{product.category}</div>
                <div className={styles.productDetails}>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <p className={styles.productDescription}>{product.description}</p>
                </div>
                <div className={styles.productMeta}>
                  <span>${product.price}</span>
                </div>
                <Link
                  href={`/products/${product._id}`}
                  className={styles.productButton}
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p>No products available yet.</p>
        )}
      </section>
    </div>
  );
}

