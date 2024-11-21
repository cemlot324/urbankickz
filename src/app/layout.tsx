import type { Metadata } from "next";
import "./globals.css";
import { InstallPrompt } from '@/components/InstallPrompt'
import { Providers } from '@/components/Providers'


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
        
        {/* iOS specific tags */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Urban Kickz" />
        
        {/* Windows specific tags */}
        <meta name="msapplication-TileColor" content="#B2D12E" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* PWA viewport tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <Providers>
          {children}
          <InstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
