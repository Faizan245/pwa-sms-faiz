"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
const AnalogClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const day = time.toLocaleDateString("en-US", { weekday: "long" });
    const date = time.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const hourDegrees = (hours % 12 + minutes / 60) * 30;
    const minuteDegrees = (minutes + seconds / 60) * 6;
    const secondDegrees = seconds * 6;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
        >
            <div className="flex flex-col items-center justify-center rounded-lg ">
                <div
                    className="relative w-48 h-48 rounded-full shadow-2xl bg-gray-800 border-8 border-gray-600 shadow-lg flex items-center justify-center"
                    role="img"
                    aria-label={`Analog clock showing ${hours}:${minutes}:${seconds}`}
                >
                    {/* Hour hand */}
                    <div
                        className="absolute w-1.5 bg-gray-300 rounded-full"
                        style={{
                            height: "25%",
                            top: "25%",
                            left: "50%",
                            marginLeft: "-3px",
                            transformOrigin: "bottom center",
                            transform: `rotate(${hourDegrees}deg)`,
                        }}
                    />
                    {/* Minute hand */}
                    <div
                        className="absolute w-1 bg-gray-400 rounded-full"
                        style={{
                            height: "35%",
                            top: "15%",
                            left: "50%",
                            marginLeft: "-2px",
                            transformOrigin: "bottom center",
                            transform: `rotate(${minuteDegrees}deg)`,
                        }}
                    />
                    {/* Second hand */}
                    <div
                        className="absolute w-0.5 bg-red-500 rounded-full"
                        style={{
                            height: "40%",
                            top: "10%",
                            left: "50%",
                            marginLeft: "-1px",
                            transformOrigin: "bottom center",
                            transform: `rotate(${secondDegrees}deg)`,
                        }}
                    />
                    {/* Center pivot */}
                    <div className="absolute w-3 h-3 bg-red-500 rounded-full" />
                </div>
                {/* Digital Clock & Date Display */}
                <div className="mt-4 text-center">
                    <div className="text-3xl font-bold font-serif tracking-wider">{time.toLocaleTimeString()}</div>
                    <div className="text-lg text-gray-400">{day}, {date}</div>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalogClock;
