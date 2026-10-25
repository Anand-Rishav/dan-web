import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.danservices.in"),
  title: {
    template: "%s | DAN SERVICES",
    default: "DAN SERVICES | Engineering Viral Cultural Moments & High-ROI Creator Campaigns",
  },
  description: "DAN SERVICES is an elite, full-service Influencer Marketing Agency specializing in high-converting campaigns across YouTube, Instagram, X (Twitter), LinkedIn, and TikTok.",
  openGraph: {
    title: "DAN SERVICES | Engineering Viral Cultural Moments & High-ROI Creator Campaigns",
    description: "DAN SERVICES is an elite, full-service Influencer Marketing Agency specializing in high-converting campaigns across YouTube, Instagram, X (Twitter), LinkedIn, and TikTok.",
    url: "https://www.danservices.in",
    siteName: "DAN SERVICES",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "DAN SERVICES Logo" }],
  },
};

// Strips DOM attributes injected by browser extensions (Bitwarden's
// bis_skin_checked/bis_register and similar __processed_* markers) before
// React hydrates, so extension noise can't trigger false hydration
// mismatch warnings. Only these known extension namespaces are removed —
// real mismatches still surface normally.
const extensionAttrScrubber = `
(function () {
  var isExtAttr = function (name) {
    return /^bis_/.test(name) || /^__processed_/.test(name);
  };
  var strip = function (el) {
    if (!el || !el.attributes) return;
    for (var i = el.attributes.length - 1; i >= 0; i--) {
      var attr = el.attributes[i];
      if (isExtAttr(attr.name)) el.removeAttribute(attr.name);
    }
  };
  var stripTree = function (root) {
    strip(root);
    if (root.querySelectorAll) {
      var nodes = root.querySelectorAll("*");
      for (var i = 0; i < nodes.length; i++) strip(nodes[i]);
    }
  };
  stripTree(document.documentElement);
  new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === "attributes") strip(m.target);
      else if (m.type === "childList") {
        for (var j = 0; j < m.addedNodes.length; j++) stripTree(m.addedNodes[j]);
      }
    }
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["bis_skin_checked", "bis_register"],
    subtree: true,
    childList: true,
  });
})();
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DAN SERVICES",
  url: "https://www.danservices.in",
  description: "DAN SERVICES is an elite, full-service Influencer Marketing Agency specializing in high-converting campaigns across YouTube, Instagram, X (Twitter), LinkedIn, and TikTok.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: "info@danservices.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {/* Runs before hydration so extension-injected attributes are gone
            by the time React reconciles the server HTML with the DOM. */}
        <script dangerouslySetInnerHTML={{ __html: extensionAttrScrubber }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
