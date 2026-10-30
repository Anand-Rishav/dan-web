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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DAN SERVICES",
  url: "https://www.danservices.in",
  logo: "https://www.danservices.in/icon.png",
  description: "DAN SERVICES is an elite, full-service Influencer Marketing Agency specializing in high-converting campaigns across YouTube, Instagram, X (Twitter), LinkedIn, and TikTok.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: "info@danservices.in",
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
  var isExtScript = function (node) {
    return node && node.nodeType === 1 && node.tagName === "SCRIPT" && (
      (node.getAttribute && node.getAttribute("data-dynamic-id")) ||
      (node.src && node.src.indexOf("chrome-extension://") === 0)
    );
  };
  stripTree(document.documentElement);
  new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === "attributes") strip(m.target);
      else if (m.type === "childList") {
        for (var j = 0; j < m.addedNodes.length; j++) {
          var node = m.addedNodes[j];
          if (isExtScript(node)) {
            if (node.parentNode) node.parentNode.removeChild(node);
          } else {
            stripTree(node);
          }
        }
      }
    }
  }).observe(document.documentElement, {
    // No attributeFilter: extension markers like __processed_<uuid> have
    // random names that can't be listed, and <body> doesn't exist yet when
    // this head script runs — so every attribute mutation must be observed.
    // strip() still only removes known extension namespaces.
    attributes: true,
    subtree: true,
    childList: true,
  });

  // Structured data is injected AFTER the page settles instead of being
  // rendered by React: extensions that replace/insert <script> elements in
  // <head> (executor-style) can then never create a hydration mismatch
  // around it, and crawlers that execute JS still read it from the DOM.
  var injectLd = function () {
    if (document.querySelector('script[data-jsonld="dan"]')) return;
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute("data-jsonld", "dan");
    s.text = ${JSON.stringify(JSON.stringify(jsonLd))};
    document.head.appendChild(s);
  };
  if (document.readyState === "complete") injectLd();
  else window.addEventListener("load", injectLd);
})();
`;

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
        {/* Runs before hydration so extension-injected attributes and script
            elements are gone by the time React reconciles the server HTML
            with the DOM. Also injects the JSON-LD after load (see inside). */}
        <script dangerouslySetInnerHTML={{ __html: extensionAttrScrubber }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
