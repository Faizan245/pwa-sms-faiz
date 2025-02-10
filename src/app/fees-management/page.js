'use client'
  import { useState, useEffect } from 'react'
  import FeesManagement from '@/pages/Fees-Management'
  
  const Page = () => {
      const [loading, setLoading] = useState(true);

      useEffect(() => {
          const timer = setTimeout(() => {
              setLoading(false);
          }, 1000); // Simulating loading time

          return () => clearTimeout(timer);
      }, []);

      if (loading) {
          return (
              <div className="flex justify-center items-center h-full">
                  <div className="flex flex-col items-center">
                      {/* Tailwind CSS Loader */}
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-gray-600">Loading...</p>
                  </div>
              </div>
          );
      }

      // Render FeesManagement directly without any wrapping CSS.
      return <FeesManagement />;
  };

  export default Page;