import React from 'react'

const Success = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 scale-105">
                <div className="flex flex-col items-center">
                    {/* Animated success icon */}
                    <div className="flex items-center justify-center relative">
                        {/* Animated outer ring */}
                        <div className="animate-spin-slow absolute h-16 w-16 border-4 border-green-400 rounded-full border-t-transparent"></div>
                        {/* Success icon */}
                        <div className="bg-green-500 p-4 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    <p className="text-lg font-semibold text-gray-700 mt-4">
                        Data added successfully!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Success