import type { Metadata } from "next";
import { Anek_Bangla, Orbitron } from "next/font/google";
import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/footer";
import { Providers } from "@/components/providers";
import "./globals.css";

const anekBangla = Anek_Bangla({
  variable: "--font-anek-bangla",
  subsets: ["bengali"],
  weight: ["400", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["900"],
});

const SITE_NAME = "Math Pro Academy";
const SITE_URL = "https://mathpro.academy";
const SITE_DESCRIPTION =
  "Math Pro Academy — বাংলায় JSC, SSC ও HSC গণিতের অনলাইন কোর্স। ভিডিও ক্লাস, লাইভ ক্লাস, প্র্যাকটিস ও র‍্যাংকিং দিয়ে A+ এর প্রস্তুতি নাও।";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Math Pro Academy — বাংলায় গণিত শেখার সেরা প্ল্যাটফর্ম",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Math Pro Academy",
    "MathPro",
    "গণিত কোর্স",
    "অনলাইন গণিত",
    "JSC গণিত",
    "SSC গণিত",
    "HSC গণিত",
    "math course bangla",
    "online math academy",
    "Bangladesh math",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "bn_BD",
    url: SITE_URL,
    title: "Math Pro Academy — বাংলায় গণিত শেখার সেরা প্ল্যাটফর্ম",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Math Pro Academy — বাংলায় গণিত শেখার সেরা প্ল্যাটফর্ম",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      translate="no"
      suppressHydrationWarning
      className={`${anekBangla.variable} ${orbitron.variable} h-full antialiased notranslate`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <div className="print:hidden">
            <AppNavbar />
          </div>
          <div className="flex-1">{children}</div>
          <div className="print:hidden">
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
