"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Artisan {
  _id: string;
  name: string;
  artisanProfile?: {
    studioName?: string;
    location?: string;
    specialty?: string;
    story?: string;
    tags?: string[];
  };
}

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      // Fetch all artisans from the database
      // For now, we'll use a simple fetch - you can create an API route for this
      const response = await fetch("/api/profiles?role=artisan");
      
      if (response.ok) {
        const data = await response.json();
        setArtisans(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching artisans:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback to featured artisans if API fails or no data
  const featuredArtisans = artisans.length > 0 ? artisans : [
    {
      _id: "1",
      name: "Luna Atelier",
      artisanProfile: {
        studioName: "Luna Atelier",
        location: "Lisbon, Portugal",
        specialty: "Sculptural brass jewelry",
        story: "Exploring soft geometric silhouettes inspired by ocean tides and moon cycles.",
      },
    },
    {
      _id: "2",
      name: "Santos Collective",
      artisanProfile: {
        studioName: "Santos Collective",
        location: "Oaxaca, Mexico",
        specialty: "Handwoven textiles",
        story: "Fourth-generation weavers using cochineal dyes and solar-powered looms.",
      },
    },
    {
      _id: "3",
      name: "Valle Kilns",
      artisanProfile: {
        studioName: "Valle Kilns",
        location: "Taos, New Mexico",
        specialty: "Minimal ceramics",
        story: "Small-batch clay vessels focused on ritual and grounded living spaces.",
      },
    },
  ];

  const getStudioName = (artisan: Artisan) => {
    return artisan.artisanProfile?.studioName || artisan.name;
  };

  const getSlug = (artisan: Artisan) => {
    return encodeURIComponent(getStudioName(artisan));
  };

  if (loading) {
    return <div className={styles.loading}>Loading artisans...</div>;
  }

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
          <article key={artisan._id} className={styles.card}>
            <h2 className={styles.cardName}>{getStudioName(artisan)}</h2>
            {artisan.artisanProfile?.location && (
              <p className={styles.cardLocation}>{artisan.artisanProfile.location}</p>
            )}
            {artisan.artisanProfile?.specialty && (
              <p className={styles.cardSpecialty}>{artisan.artisanProfile.specialty}</p>
            )}
            {artisan.artisanProfile?.story && (
              <p className={styles.cardStory}>{artisan.artisanProfile.story}</p>
            )}
            <div className={styles.cardTags}>
              <span className={styles.tag}>Commissions open</span>
              <span className={styles.tag}>Ships worldwide</span>
            </div>
            <Link
              href={`/profiles/artisan/${getSlug(artisan)}`}
              className={styles.viewProfileLink}
            >
              View Profile →
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
