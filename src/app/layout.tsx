import type { Metadata } from "next";
import Link from "next/link";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-heading",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description:
    "Discover artisan-made goods, explore makers, and celebrate handcrafted stories.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/profiles", label: "Profiles" },
];

const secondaryLinks = [
  { href: "/customers", label: "Customers" },
  { href: "/products/manage", label: "Add Product" },
  { href: "/reviews", label: "Reviews" },
  { href: "/search", label: "Search & Filter" },
  { href: "/dashboard", label: "Secure Dashboard" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} ${styles.body}`}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <Link
                href="/"
                className={styles.brand}
              >
                Handcrafted Haven
              </Link>
              <nav className={styles.nav}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={styles.navLink}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className={styles.authCtas}>
                <Link href="/auth/login" className={styles.loginLink}>
                  Login
                </Link>
                <Link href="/auth/signup" className={styles.ctaButton}>
                  Join the Community
                </Link>
              </div>
            </div>
          </header>
          <div className={styles.subNav}>
            <nav className={styles.subNavContent}>
              {secondaryLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.subNavLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}
