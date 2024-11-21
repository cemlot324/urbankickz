import type { Metadata } from "next";
import "./globals.css";
import { ProductProvider } from '@/context/ProductContext'
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { InstallPrompt } from '@/components/InstallPrompt'


export const metadata: Metadata = {
  title: "Urban Kickz",
  description: "Your premier destination for exclusive sneakers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#B2D12E" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Urban Kickz" />
      </head>
      <body>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              {children}
              <InstallPrompt />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
