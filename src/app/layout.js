'use client'
import { Inter } from "next/font/google";
import Sidebar from "../pages/SideBar/SideBar"; // Assuming you already have a Sidebar component
import { useEffect, useState } from "react";
import Login from "../pages/login";
import './globals.css'; // or './tailwind.css' if using a different file name
// Your Login component path

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for the login status (for example, from localStorage or session)
  useEffect(() => {
    const userLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(userLoggedIn);
    setIsLoading(false);
  }, []);

  // If loading, show the loader
  if (isLoading) {
    return (
      <html lang="en">
        <head>
          <link href="/manifest.json" rel="manifest" />
        </head>
        <body>
          <div className="flex h-screen justify-center items-center"
            style={{
              backgroundImage: 'url("/feeRecieptBG.jpg")',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}>
            <div>Loading Please Wait...</div>
          </div>
        </body>
      </html>

    );
  }

  // If not logged in, show the login component
  if (!isLoggedIn) {
    return (
      <html lang="en">
        <head>
          <link href="/manifest.json" rel="manifest" />
        </head>
        <body>
          <Login onLogin={() => setIsLoggedIn(true)} />
        </body>
      </html>
    );
  }
//hello
  return (
    <html lang="en">
      <head>
        <link href="/manifest.json" rel="manifest" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <div className="flex h-screen max-md:flex-col bg-gray-100">
          <Sidebar /> {/* Sidebar on the left */}
          <main className="flex-1  p-6 max-lg:p-2 overflow-y-auto">
            {children} {/* Main content */}
          </main>
        </div>
      </body>
    </html>
  );
}
